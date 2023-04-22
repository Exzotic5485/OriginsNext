const { Schema, model, Types, Types: { ObjectId } } = require('mongoose')
const tagsList = require('../shared/filters')

const tagsArray = tagsList.map((tag) => tag.value)

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
    created: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    statics: {
        findByIdOrSlug(idOrSlug, projection = {}) {
            if(ObjectId.isValid(idOrSlug) && String(new ObjectId(idOrSlug)) === idOrSlug){
                return this.findOne({ _id: idOrSlug }, projection)
            }

            return this.findOne({ slug: idOrSlug }, projection)
        }
    },
    methods: {
        softDelete() {
            this.deleted = true
            this.deletedAt = Date.now()
            
            return this.save()
        },
        unDelete() {
            this.deleted = false
            this.deletedAt = null
            
            return this.save()
        }
    }
})

module.exports = model('Datapacks', schema)