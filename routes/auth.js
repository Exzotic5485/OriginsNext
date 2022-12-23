const { Router } = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { checkNotAuthenticated, checkAuthenticated } = require("../utils/auth");
const users = require("../models/Users");

module.exports = {
    route: '/auth',
    execute: ({ router, nextApp }) => {
        router.get("/login", checkNotAuthenticated, (req, res) => nextApp.render(req, res, "/login"));
    
        router.post("/login", checkNotAuthenticated, passport.authenticate('local', {}), (req, res) => {
            res.send({ success: true })
        });
    
        // Register
        router.get("/register", checkNotAuthenticated, (req, res) => nextApp.render(req, res, "/register"));
    
        router.post("/register", checkNotAuthenticated, async (req, res) => {
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
    }
}
