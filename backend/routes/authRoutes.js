const express = require('express');
const {
  registerUser,
  loginUser,
  updateUserPreferences,
  getUserDetails,
  getMovies, // Import getMovies
  getRecommendedMovies, // Import getRecommendedMovies
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { getUserById } = require("../controllers/authController");

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/preferences', authenticateToken, updateUserPreferences);
router.get('/user', authenticateToken, getUserDetails);
router.get('/movies', getMovies);
router.post('/recommended', authenticateToken, getRecommendedMovies); // New route for recommended movies
router.get("/user/:id", getUserById);

module.exports = router;
