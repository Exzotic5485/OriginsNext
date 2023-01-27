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
    }
}