const passport = require("passport");
const bcrypt = require("bcrypt");
const { checkNotAuthenticated, checkAuthenticated } = require("../utils/auth");
const users = require("../models/Users");
const crypto = require('crypto')

const rateLimit = require('express-rate-limit');
const { sendVerificationEmail } = require("../utils/emailHelper");

const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
})

module.exports = {
    route: '/auth',
    execute: ({ router, nextApp }) => {
    
        router.post("/login", checkNotAuthenticated, loginLimiter, passport.authenticate('local', {}), async (req, res) => {
            req.user.lastLoginIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress 
            await req.user.save()

            res.send({ success: true, shouldVerify: !req.user.verified })
        });
    
    
        router.post("/register", checkNotAuthenticated, loginLimiter, async (req, res) => {
            const userExists = await users.exists({ $or: [{ username: { $regex: `^${req.body.username}$`, $options: 'i' } }, { email: { $regex: `^${req.body.email}$`, $options: 'i' } }] });
    
            if (userExists) {
                return res.send({ invalid: true });
            }

            const usersIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const ipUsed = await users.exists({ lastLoginIp: usersIp })

            if(ipUsed) {
                return res.send({ invalid: true })
            }
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
            const newUser = await users.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                lastLoginIp: ipUsed,
                verificationCode: crypto.randomBytes(20).toString('hex')
            });

            sendVerificationEmail(newUser.email, newUser.verificationCode)
            res.send({ success: true, username: newUser.username })
        });

        router.get('/logout', checkAuthenticated, (req, res) => {
            const redirect = req.query.redirect || '/';

            req.logout(() => {
                res.redirect(redirect)
            })
        })

        router.get('/discord', passport.authenticate('discord'))

        router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/?loginError=true', successRedirect: '/datapacks' }))

        router.get('/verify/:code', checkAuthenticated, async (req, res) => {
            const verificationCode = req.params.code;

            if(verificationCode == "resend") {
                if(req.user.verified) return res.send(403)

                await sendVerificationEmail(req.user.email, req.user.verificationCode)
    
                return res.send({ success: true })
            }

            if(verificationCode != req.user.verificationCode) return res.send(400)

            req.user.verified = true;
            await req.user.save()

            res.redirect('/')
        })
    }
}
