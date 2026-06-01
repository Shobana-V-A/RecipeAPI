const Recipe = require('../models/recipeModel');

// Create a new recipe
exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = await Recipe.create(req.body);
        res.status(201).json({ status: 'success', data: { recipe: newRecipe } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Retrieve all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({ status: 'success', results: recipes.length, data: { recipes } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve recipes' });
    }
};

// Retrieve a single recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ status: 'fail', message: 'Recipe not found' });
        }
        res.status(200).json({ status: 'success', data: { recipe } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: 'Invalid ID format' });
    }
};

// Update a recipe by ID
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Returns the newly updated document
            runValidators: true // Enforces model validation on updates
        });
        if (!recipe) {
            return res.status(404).json({ status: 'fail', message: 'Recipe not found' });
        }
        res.status(200).json({ status: 'success', data: { recipe } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ status: 'fail', message: 'Recipe not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};