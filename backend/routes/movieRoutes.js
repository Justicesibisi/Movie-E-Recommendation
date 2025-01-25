const express = require('express');
const {
  getMovies,
  getRecommendedMovies,
  getCategories,
  setPreferences,
  getTvShows,
} = require('../controllers/movieController'); // Importing controller functions
const authenticateToken = require('../middleware/authMiddleware'); // Token authentication middleware

const router = express.Router();

// Movies and TV shows with optional genres and pagination
router.get('/movies', getMovies); // Fetch movies
router.get('/tvshows', getTvShows); // Fetch TV shows

// User-specific endpoints
router.post('/recommendations', authenticateToken, getRecommendedMovies); // Get personalized recommendations
router.get('/categories', authenticateToken, getCategories); // Fetch categories and preferences
router.post('/preferences', authenticateToken, setPreferences); // Set user preferences

module.exports = router;
