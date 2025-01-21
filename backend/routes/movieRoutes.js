const express = require('express');
const {
  getMovies,
  getRecommendedMovies,
  getCategories,
  setPreferences,
  getTvShows, 
} = require('../controllers/movieController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/movies', getMovies);
router.post('/recommendations', authenticateToken, getRecommendedMovies);
router.get('/categories', authenticateToken, getCategories);
router.post('/preferences', authenticateToken, setPreferences);
router.get('/tvshows', authenticateToken, getTvShows); // Add this line

module.exports = router;
