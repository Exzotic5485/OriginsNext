const Datapacks = require('../models/Datapacks')

const { checkAuthenticated, checkCanManageDatapack } = require('../utils/auth')

const { isValidObjectId, Types: { ObjectId } } = require('mongoose')
const Users = require('../models/Users')

module.exports = {
    route: '/datapack',
    execute: ({ router, nextApp }) => {
        router.get('/new', checkAuthenticated, async (req, res) => {
            nextApp.render(req, res, '/datapackCreate')
        })

        router.post('/new', checkAuthenticated, async (req, res) => {
            const data = req.body;

            res.sendStatus(200)
        })

        router.get('/:id/download', async (req, res) => {
            const datapack = await Datapacks.findByIdOrSlug(req.params.id);

            if(!datapack) return res.sendStatus(404);

            const fileId = req.query.file

            if(fileId) {
                const file = datapack.files.find(file => file._id.equals(fileId))

                if(!file) return res.sendStatus(404);

                await Datapacks.updateOne({ _id: datapack._id }, { $inc: { downloads: 1 } })
                return res.download(`./public/uploads/files/${datapack._id}/${file.fileName}`)
            }

            const file = datapack.files.filter(file => file.featured).sort((a, b) => b.uploaded - a.uploaded)[0]

            if(!file) return res.sendStatus(404);


            await Datapacks.updateOne({ _id: datapack._id }, { $inc: { downloads: 1 } })
            return res.download(`./public/uploads/files/${datapack._id}/${file.fileName}`)
        })

        router.get('/:id/edit', checkAuthenticated, checkCanManageDatapack, async (req, res) => {
            const datapack = await Datapacks.findByIdOrSlug(req.params.id, { title: 1, description: 1, slug: 1, image: 1, tags: 1, summary: 1 }).lean();

            if(!datapack) return res.sendStatus(404);

            datapack.id = datapack._id.toString();
            delete(datapack._id)
            delete(datapack.__v)

            nextApp.render(req, res, '/datapackEdit', { datapack })
        })
        
        router.get('/:id', async (req, res) => {
            const idOrSlug = req.params.id

            try {
                const datapack = await Datapacks.findOne(isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }).lean();

                if(!datapack) return res.sendStatus(404)

                datapack.id = datapack._id.toString();
                delete(datapack._id)
                delete(datapack.__v)

                datapack.userLiked = datapack.likes.some(like => like.equals(req?.user?._id))
                datapack.likes = datapack.likes.length

                datapack.owner = await Users.findById(datapack.owner, { username: 1, image: 1 }).lean()
                datapack.owner.id = datapack.owner._id.toString();
                delete(datapack.owner._id)

                if(req.user) datapack.isOwner = datapack.owner.id == req.user._id;

                datapack.files.forEach(file => {
                    file.id = file._id.toString();
                    delete(file._id)

                    file.uploaded = file.uploaded.toISOString()
                })

                console.log(datapack)
    
                nextApp.render(req, res, '/datapack', { datapack })
            } catch (e) {
                console.log(e)
                res.sendStatus(404)
            }
        })

        router.patch(':id/update/image', checkCanManageDatapack, async (req, res) => {

        })
    }
}