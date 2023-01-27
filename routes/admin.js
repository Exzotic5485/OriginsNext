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

            const reports = await Reports.find({ resolved: false }, { __v: 0 }).lean();

            for(const report of reports) {
                report.id = report._id.toString()
                delete report._id

                report.datapack = await Datapacks.findById(report.datapack, { slug: 1, title: 1 }).lean();
                report.reporter = await Users.findById(report.reporter, { username: 1}).lean();

                report.datapack.id = report.datapack._id.toString()
                delete report.datapack._id

                report.reporter.id = report.reporter._id.toString()
                delete report.reporter._id

                report.created = report.created.toISOString()
            }

            console.log(reports)

            nextApp.render(req, res, '/admin/reports', { reports })
        })
    }
}
