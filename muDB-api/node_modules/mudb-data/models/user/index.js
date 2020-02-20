const { Schema } = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: isEmail
    },

    password: {
        type: String,
        required: true
    },

    userData: {
        name: {
            type: String,
            default: 'not defined'
        },

        surname: {
            type: String,
            default: 'not defined'
        },

        contact: {
            tel: Number,
            address1: String,
            address2: String,
            city: String,
            province: String,
            postalCode: String,
            country: String,
        }
    },

    appData: [{
        appId: {
            type: String,
            default: 'noApp'
        },

        role: {
            type: String,
            enum: ['god', 'owner', 'admin', 'user'],
            default: 'user'
        }
    }]
})

module.exports = userSchema