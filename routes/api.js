const Datapacks = require('../models/Datapacks')
const Users = require('../models/Users')

const { isValidObjectId, Types: { ObjectId } } = require('mongoose')

const { registerRoutes } = require('../utils/routes')
const { checkAuthenticated } = require('../utils/auth')

const { datapackImageUpload }= require('../utils/multer')

function generateId(req, res, next) {
    req.generatedId = new ObjectId();
    next();
}

module.exports = {
    route: '/api',
    execute: ({ router, nextApp }) => {

        router.get('/datapacks', async (req, res) => {
            const pageNumber = req.query.page || 1;
            const limit = req.query.limit || 15;

            const filters = req.query.filters ? req.query.filters.split(',') : []
            const searchTerm = req.query.search || "";
            const sort = req.query.sort || "downloads";

            const query = filters.length > 0 ? { $and: [ { tags: { $all: filters } }, { tags: { $exists: true } }, { title: { $regex: `.*${searchTerm}.*`, $options: 'i' } }, { deleted: false } ]} : {title: { $regex: `.*${searchTerm}.*`, $options: 'i' }, deleted: false }
    
            const datapacks = await Datapacks.find(query, { _v: 0 }).skip(pageNumber == 1 ? 0 : (pageNumber * limit) - limit).limit(limit).lean().sort({ [sort]: -1 });

            for (const datapack of datapacks) {
                datapack.owner = await Users.findById(datapack.owner, { username: 1, _id: 0 }).lean();

                console.log(datapack.owner)
            }

            const totalPages = Math.ceil((await Datapacks.countDocuments(query)) / limit);

            res.send({ datapacks, totalPages });
        })
    }
}
