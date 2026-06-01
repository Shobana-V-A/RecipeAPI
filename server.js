const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRoutes);

app.use((req, res) => {
    res.status(404).json({ status: 'fail', message: `Can't find ${req.originalUrl} on this server!` });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.error('DB connection error:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});