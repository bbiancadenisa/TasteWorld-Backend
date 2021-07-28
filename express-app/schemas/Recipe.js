const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    prepTime: {
        type: Number,
        required: true
    },
    prepInstructions: {
        type: String,
        required: true
    },
})

const Recipe = mongoose.model("Recipe" ,recipeSchema);

module.exports = Recipe;