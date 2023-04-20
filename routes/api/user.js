const { isValidObjectId } = require('mongoose');
const Datapacks = require('../../models/Datapacks')
const Users = require('../../models/Users');
const { checkAuthenticated, checkCanManageDatapack, checkCanManageProfile } = require('../../utils/auth');
const { userImageUpload } = require('../../utils/multer');


module.exports = {
    route: '/user',
    execute: ({ router, nextApp }) => {
        router.get('/', async (req, res) => {
            const user = await Users.findById(req?.user?._id, { username: 1, image: 1, moderator: 1, notifications: 1, _id: 0 }).lean();

            user ? res.send(user) : res.sendStatus(401)
        })

        router.post('/:id/edit', checkAuthenticated, checkCanManageProfile, userImageUpload.single('image'), async (req, res) => {
            const id = req.params.id;

            if(!isValidObjectId(id)) return res.sendStatus(400);

            const user = await Users.findById(id);

            if(!user) return res.sendStatus(404);

            const { username, email } = req.body;

            if(username && username !== user.username) {
                if(await Users.exists({ username: { $regex: username, $options: 'i' } })) return res.send({ error: "Username already taken!" })

                user.usernameHistory.push(user.username);
                user.username = username;
            }

            if(email && email !== user.email) {
                if(await Users.exists({ email: { $regex: email, $options: 'i' } })) return res.send({ error: "Email already in use!" })

                user.email = email;
            }

            if(req.file) user.image = req.file.filename;

            await user.save();

            res.send({ success: true })
        })

        router.post('/notifications/read', checkCanManageProfile, async (req, res) => {
            try {
                const notificationId = req.body.id;
    
                await Users.updateOne({ _id: req.user._id }, { $pull: { notifications: { _id: notificationId } } });
    
                res.send({ success: true })
            } catch (e) {
                res.sendStatus(500)
            }
        })
    }
}