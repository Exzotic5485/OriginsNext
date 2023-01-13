const { Router } = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const fs = require('fs')
const { checkNotAuthenticated, checkAuthenticated } = require("../utils/auth");
const users = require("../models/Users");

const rateLimit = require('express-rate-limit')

const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
})

const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 15,
	standardHeaders: true,
	legacyHeaders: false,
})

module.exports = {
    route: '/auth',
    execute: ({ router, nextApp }) => {
    
        router.post("/login", checkNotAuthenticated, loginLimiter, passport.authenticate('local', {}), (req, res) => {
            res.send({ success: true })
        });
    
    
        router.post("/register", checkNotAuthenticated, registerLimiter, async (req, res) => {
            console.log(req.body)
            const userExists = await users.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    
            if (userExists) {
                return res.send({ invalid: true });
            }
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
            const newUser = await users.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
    
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
    }
}
