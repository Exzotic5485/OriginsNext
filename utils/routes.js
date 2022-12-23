const fs = require('fs')
const { Router } = require('express')

function registerRoutes(directory, { server, nextApp }) {
    const files = fs.readdirSync(__dirname).filter(file => file != 'index.js')

    for (const file of files) {
        const route = require(path.join(__dirname, `/${file}`))

        const router = Router()

        route.execute({ router, nextApp })

        server.use(route.route, router)
    }
}

module.exports = { registerRoutes }