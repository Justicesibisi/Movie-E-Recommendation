const express = require('express');
const {
  getMovies,
  getRecommendedMovies,
  getCategories,
  setPreferences,
} = require('../controllers/movieController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to fetch all movies
router.get('/movies', getMovies);

// Route to fetch personalized recommendations (requires authentication)
router.post('/recommendations', authenticateToken, getRecommendedMovies);

// Route to fetch categories
router.get('/categories', authenticateToken, getCategories);

// Route to set user preferences
router.post('/preferences', authenticateToken, setPreferences);

module.exports = router;
