const express = require('express');
const {
    getMovies,
    getCategories,
    setPreferences,
} = require('../controllers/movieController');
const { loginUser, registerUser } = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Movie routes
router.get('/movies', getMovies);
router.get('/movies/categories', getCategories);
router.post('/movies/preferences', setPreferences);

module.exports = router;
