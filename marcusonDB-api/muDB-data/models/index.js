const mongoose = require('mongoose')
const userSchema = require('./user')
const appSchema = require('./app')


const model = mongoose.model.bind(mongoose)

module.exports = {
    Users: model('Users', userSchema),
    Apps: model('Apps', appSchema)
}