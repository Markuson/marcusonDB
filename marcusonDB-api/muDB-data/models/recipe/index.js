const { Schema } = require('mongoose')


const ingredientSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    quantity:{
        type: Number,
        required: true
    },

    unit:{
        type: String,
        enum:["dr", "pn", "tsp", "tbsp", "cup", "gr", "kg", "ml", "l"]
    }
})

const recipeSchema = new Schema({

    userId:{

    },

    name: {
        type: String,
        required: true
    },

    publicId:{
        type:String,
        required: false
    },

    imageUrl:{
        type: String,
        required: false
    },

    description: {
        type: String,
        required: false
    },

    ingredients:[ingredientSchema],

    steps:[{type:String, required:true}],

    date: {
        type: Date,
        required: true
    }

})

module.exports = recipeSchema