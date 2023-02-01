const Datapacks = require('../models/Datapacks')
const Users = require('../models/Users')
const Reports = require('../models/Reports')

const { isValidObjectId, Types: { ObjectId } } = require('mongoose')

const { registerRoutes } = require('../utils/routes')
const { checkAuthenticated, checkIsModerator } = require('../utils/auth')

const { datapackImageUpload }= require('../utils/multer')

function generateId(req, res, next) {
    req.generatedId = new ObjectId();
    next();
}

module.exports = {
    route: '/admin',
    execute: ({ router, nextApp }) => {

        router.use(checkIsModerator)

        router.get('/users', async (req, res) => {
            nextApp.render(req, res, '/admin/users')
        })

        router.get('/reports', async (req, res) => {

            nextApp.render(req, res, '/admin/reports')
        })
    }
}
