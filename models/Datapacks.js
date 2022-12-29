const { Schema, model, Types, isValidObjectId } = require('mongoose')
const tagsList = require('../shared/filters')

const tagsArray = tagsList.map((tag) => tag.value)

console.log(tagsArray)

const schema = new Schema({
    owner: {
        type: Types.ObjectId,
        required: true
    },
    title: String,
    description: String,
    summary: String,
    slug: {
        unique: true,
        type: String
    },
    image: {
        type: String,
        default: "default.png"
    },
    tags: {
        type: Array,
        of: {
            type: String,
            enum: tagsArray
        }
    },
    likes: {
        type: Array,
        of: {
            type: Types.ObjectId
        },
        default: []
    },
    downloads: {
        type: Number,
        default: 0
    },
    files: {
        type: [
            {
                displayName: String,
                fileName: String,
                supportedVersions: [String],
                featured: Boolean,
                uploaded: Date
            }
        ],
        default: []
    },
    created: Date
}, {
    statics: {
        findByIdOrSlug(idOrSlug, projection = {}) {
            return this.findOne(isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }, projection)
        }
    }
})

module.exports = model('Datapacks', schema)