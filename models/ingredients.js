const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    servingSizeAmount: {
        type: Number,
        required: true
    },
    servingSizeUnit: {
        type: String,
        required: true
    },
    carb: {
        type: Number,
        required: true
    },

    protein: {
        type: Number,
        required: true
    },

    fat: {
        type: Number,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Ingredient', ingredientSchema)