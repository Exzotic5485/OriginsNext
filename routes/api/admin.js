const Datapacks = require('../../models/Datapacks')
const Reports = require('../../models/Reports')
const Users = require('../../models/Users')
const { checkIsModerator } = require('../../utils/auth')

module.exports = {
    route: '/admin',
    execute: ({ router, nextApp }) => {

        router.use(checkIsModerator)

        router.get('/users', async (req, res) => {
            try {
                const searchTerm = req.query.search;

                const users = await Users.find({ $or: [
                    { username: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
                    { email: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
                    { discordId: { $regex: `.*${searchTerm}.*`, $options: 'i' } }
                ]}, { username: 1, email: 1, moderator: 1, discordId: 1, usernameHistory: 1, banned: 1, image: 1 }).lean()

                users.forEach(user => {
                    user.id = user._id.toString()
                    delete user._id
                })
    
                res.send(users)
            } catch(e) {
                res.sendStatus(500)
            }
        })

        router.post('/user/:id/ban', async (req, res) => {
            try {
                const user = await Users.findById(req.params.id)

                if(!user) return res.sendStatus(404)

                user.banned = true

                await user.save()

                res.send({ success: true })
            } catch(e) {
                res.sendStatus(500)
            }
        })

        router.post('/user/:id/unban', async (req, res) => {
            try {
                const user = await Users.findById(req.params.id)

                if(!user) return res.sendStatus(404)

                user.banned = false

                await user.save()

                res.send({ success: true })
            } catch(e) {
                res.sendStatus(500)
            }
        })

        router.post('/user/:id/notify', async (req, res) => {
            try {
                await Users.findByIdAndUpdate(req.params.id, { $push: { notifications: { title: req?.body?.title, message: req.body?.message, color: req.body?.color, link: req.body?.link } } })

                res.send({ success: true })
            } catch(e) {
                res.sendStatus(500)
            }
        })

        router.get('/reports', async (req, res) => {
            const reports = await Reports.find(req.query.showResolved === "true" ? {} : { resolved: false }, { __v: 0 }).lean();

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

            res.send(reports)
        })

        router.post('/report/:id/resolve', async (req, res) => {
            try {
                const { id } = req.params;

                await Reports.findByIdAndUpdate(id, { resolved: req.query.undo == "true" ? false : true })
    
                res.sendStatus(200)
            } catch(e) {
                res.sendStatus(500)
            }
        })

        router.post('/report/:id/action', async (req, res) => {
            try {
                const { id } = req.params;

                const report = await Reports.findById(id)

                if(!report) return res.sendStatus(404)

                const datapack = await Datapacks.findById(report.datapack)  

                if(!datapack) return res.sendStatus(404)

                await datapack.softDelete();

                await Users.findByIdAndUpdate(report.reporter, { $push: { notifications: { title: "Datapack Deleted", message: `Your report on ${datapack.title} has been resolved. The datapack has been deleted.`, color: "success" }}})
                await Users.findByIdAndUpdate(datapack.owner, { $push: { notifications: { title: "Datapack Deleted", message: `Your datapack ${datapack.title} has been deleted by the moderation team. Please follow our content guidelines!`, color: "error" }}})

                res.sendStatus(200)
            } catch (e) {
                res.sendStatus(500)
            }
        })
    }
}