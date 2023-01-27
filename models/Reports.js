const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    datapack: {
        type: Types.ObjectId,
        required: true
    },
    reporter: {
        type: Types.ObjectId,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    resolved: {
        type: Boolean,
        default: false
    }
})

module.exports = model('Reports', schema)