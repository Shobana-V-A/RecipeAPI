const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A recipe must have a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    ingredients: {
        type: [String],
        required: [true, 'A recipe must have at least one ingredient'],
        validate: {
            validator: function (v) { return v.length > 0; },
            message: 'Ingredients array cannot be empty'
        }
    },
    instructions: {
        type: String,
        required: [true, 'A recipe must include instructions']
    },
    prepTimeMinutes: {
        type: Number,
        required: [true, 'Please provide the preparation time in minutes']
    },
    servings: {
        type: Number,
        default: 4
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);