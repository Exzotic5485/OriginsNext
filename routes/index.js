const { Router } = require("express");
const fs = require('fs')
const path = require('path')

const Datapacks = require('../models/Datapacks')

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

    router.get("/", (req, res) => {
        return nextApp.render(req, res, "/home", { user: "Test User" });
    });

    router.get("/datapacks", async (req, res) => {

        nextApp.render(req, res, "/datapacks");
    });

    registerRoutes({ nextApp, server })

    router.all('/_next/*', nextHandler)

    return router;
}

module.exports = router;
