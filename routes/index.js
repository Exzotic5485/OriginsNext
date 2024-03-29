const { Router } = require("express");
const fs = require('fs')
const path = require('path')

const Datapacks = require('../models/Datapacks')
const Users = require('../models/Users');
const { checkIsModerator } = require("../utils/auth");

function registerRoutes({ server, nextApp }, directory = __dirname, root = '') {
    const files = fs.readdirSync(directory).filter(file => file != 'index.js')

    for (const file of files) {

        if (fs.lstatSync(path.join(directory, `/${file}`)).isDirectory()) {
            registerRoutes({ server, nextApp }, path.join(directory, `/${file}`), "/" + file)
            continue
        }

        const route = require(path.join(directory, `/${file}`))

        const router = Router()

        route.execute({ router, nextApp })

        server.use(root + route.route, router)
    }
}

function router({ nextApp, nextHandler, server }) {
    const router = Router();

    router.get("/verify", (req, res) => {
        return nextApp.render(req, res, "/verify");
    });

    router.get("/discord", (req, res) => res.redirect('https://discord.gg/vg6Vf8esxH'))

    router.use((req, res, next) => {
        if(req.path.startsWith('/auth/') || req.path.startsWith('/_next/')) return next()

        if(req?.user?.banned) {
            console.log("Banned user tried to access " + req.url)
            return nextApp.render(req, res, "/banned")
        }

        if(req.isAuthenticated() && !req.user.verified) {
            return res.redirect('/verify')
        }

        next()
    })

    router.get("/", (req, res) => {
        return nextApp.render(req, res, "/home");
    });

    router.get("/datapacks", async (req, res) => {

        nextApp.render(req, res, "/datapacks");
    });


    router.get("/user/:username", async (req, res) => {
        const user = await Users.findOne({ username: { $regex: `^${req.params.username}$`, $options: 'i' } }, { username: 1, image: 1, moderator: 1, email: 1 }).lean();

        if(!user) return res.sendStatus(404)

        user.id = user._id.toString();
        delete(user._id)

        const datapacks = await Datapacks.find({ owner: user.id }, { title: 1, summary: 1, slug: 1, image: 1, deleted: 1, likes: 1, downloads: 1, _id: 0 }).lean() || [];

        user.datapacks = datapacks

        user.likes = 0
        user.downloads = 0

        for (const datapack of user.datapacks) {
            user.likes += datapack.likes.length;
            user.downloads += datapack.downloads;

            datapack.likes = datapack.likes.length
        }

        if(req.user) user.isUser = user.id == req.user._id;

        user.email = user.isUser || req?.user?.moderator ? user.email : null;

        nextApp.render(req, res, "/user", { user })
    })

    router.get('/admin', checkIsModerator, (req, res) => {

    })

    router.get('/tos', (req, res) => nextApp.render(req, res, '/tos'))
    router.get('/privacy', (req, res) => nextApp.render(req, res, '/privacy'))

    registerRoutes({ nextApp, server: router })

    router.all('/_next/*', nextHandler)

    return router;
}

module.exports = router;
