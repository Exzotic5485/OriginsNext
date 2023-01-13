const { Schema, model } = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    image: {
        type: String,
        default: "default.png"
    },
    moderator: {
        type: Boolean,
        default: false
    },
    discordId: String
})

module.exports = model('Users', schema)