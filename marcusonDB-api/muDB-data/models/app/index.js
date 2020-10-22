const { Schema } = require('mongoose')
const recipeSchema = require ('../recipe')

const ecommerceElementSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    publicId:{
        type:String,
        required: true
    },

    imageUrl:{
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        default: 0
    }
})

const portfolioElementSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    publicId:{
        type:String,
        required: true
    },

    imageUrl:{
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        required: true
    }

})

const appSchema = new Schema({
    appId: {
        type: String,
        required: true,
        unique: true,
    },

    owner: {
        type: String,
        default: 'marcuson.dev'
    },

    type: {
        type: String,
        enum: ["portfolio", "ecommerce", "other"]
    },

    ecommerce: [ecommerceElementSchema],

    portfolio: [portfolioElementSchema],

    recipes: [recipeSchema]

})

module.exports = appSchema