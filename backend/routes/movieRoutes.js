const express = require('express');
const { getMovies, getRecommendedMovies } = require('../controllers/movieController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/movies', getMovies); // Fetch popular movies
router.post('/recommended', authenticateToken, getRecommendedMovies); // Personalized recommendations

module.exports = router;
