const express = require('express');
const {
    getMovies,
    getPopularMovies,
    getRecommendedMovies,
    getCategories,
} = require('../controllers/movieController'); // Corrected path
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to fetch all movies
router.get('/movies', getMovies);

// Route to fetch popular movies
router.get('/popular', getPopularMovies);

// Route to fetch personalized recommendations (requires authentication)
router.post('/recommendations', authenticateToken, getRecommendedMovies);

// Route to fetch categories
router.get('/categories', getCategories);

module.exports = router;
