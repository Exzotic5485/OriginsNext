const Datapacks = require('../models/Datapacks')

const { checkAuthenticated, checkCanManageDatapack, checkNotDeleted } = require('../utils/auth')

const { isValidObjectId, Types: { ObjectId } } = require('mongoose')
const Users = require('../models/Users')

const DownloadManger = require('../utils/downloadManager')

module.exports = {
    route: '/datapack',
    execute: ({ router, nextApp }) => {
        const downloadManager = new DownloadManger();

        router.get('/', (req, res) => res.redirect('/datapacks'))

        router.get('/new', checkAuthenticated, async (req, res) => {
            nextApp.render(req, res, '/datapackCreate')
        })

        router.get('/:id/download', checkNotDeleted, async (req, res) => {
            const datapack = await Datapacks.findByIdOrSlug(req.params.id);

            if(!datapack) return res.sendStatus(404);

            const fileId = req.query.file

            if(fileId) {
                const file = datapack.files.find(file => file._id.equals(fileId))

                if(!file) return res.sendStatus(404);

                if(!downloadManager.checkDownloaded(datapack._id, req.ip)) {
                    await Datapacks.updateOne({ _id: datapack._id }, { $inc: { downloads: 1 } })
    
                    downloadManager.addDownload(datapack._id, req.ip)
                }

                return res.download(`./public/uploads/files/${datapack._id}/${file.fileName}`)
            }

            const file = datapack.files.filter(file => file.featured).sort((a, b) => b.uploaded - a.uploaded)[0]

            if(!file) return res.sendStatus(404);

            if(!downloadManager.checkDownloaded(datapack._id, req.ip)) {
                await Datapacks.updateOne({ _id: datapack._id }, { $inc: { downloads: 1 } })

                downloadManager.addDownload(datapack._id, req.ip)
            }

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
        
        router.get('/:id', checkNotDeleted, async (req, res) => {
            const idOrSlug = req.params.id

            try {
                const datapack = await Datapacks.findOne(isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }, { deletedAt: 0 }).lean();

                if(!datapack) return res.sendStatus(404)

                datapack.id = datapack._id.toString();
                delete(datapack._id)
                delete(datapack.__v)

                datapack.created = datapack.created.toISOString()

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
