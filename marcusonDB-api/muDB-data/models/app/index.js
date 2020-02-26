const { Schema } = require('mongoose')

const appSchema = new Schema({
    appId: {
        type: String,
        required: true,
        unique: true,
    },

    owner: {
        type: String,
        default: 'marcuson.dev'
    }
})

module.exports = appSchema