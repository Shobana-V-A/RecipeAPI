const Recipe = require('../models/recipeModel');
const Joi = require('joi');

// ---------------------------------------------------------
// VALIDATION SCHEMA (Matches Mongoose Model Fields)
// ---------------------------------------------------------
const recipeValidationSchema = Joi.object({
    title: Joi.string().trim().max(100).required()
        .messages({
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'A recipe must have a title'
        }),
    ingredients: Joi.array().items(Joi.string()).min(1).required()
        .messages({
            'array.min': 'Ingredients array cannot be empty',
            'any.required': 'A recipe must have at least one ingredient'
        }),
    instructions: Joi.string().required()
        .messages({
            'any.required': 'A recipe must include instructions'
        }),
    prepTimeMinutes: Joi.number().integer().min(0).required()
        .messages({
            'any.required': 'Please provide the preparation time in minutes'
        }),
    servings: Joi.number().integer().min(1).optional() // Optional because Mongoose defaults to 4
});

// ---------------------------------------------------------
// CONTROLLER FUNCTIONS
// ---------------------------------------------------------

// Create a new recipe
exports.createRecipe = async (req, res) => {
    try {
        // 1. Validate incoming payload against Joi rules
        const { error } = recipeValidationSchema.validate(req.body);

        // 2. Stop execution if validation fails and return 400
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.details[0].message
            });
        }

        // 3. Save to database if validation passes
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
        // 1. Convert all keys to optional so partial updates are allowed
        const updateSchema = recipeValidationSchema.fork(
            ['title', 'ingredients', 'instructions', 'prepTimeMinutes', 'servings'],
            (schema) => schema.optional()
        );

        // 2. Validate update payload
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.details[0].message
            });
        }

        // 3. Run patch updates against the database
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
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
