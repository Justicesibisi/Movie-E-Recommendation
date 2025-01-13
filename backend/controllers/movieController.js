const jwt = require('jsonwebtoken');
const axios = require('axios');

// Mock data for categories and user preferences
const allCategories = ['Action', 'Drama', 'Comedy', 'Thriller'];
const userPreferences = {}; // Store preferences per user

// Middleware to verify token
const isAuthenticated = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get popular movies (accessible to everyone)
const getMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
    );
    const popularMovies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      description: movie.overview,
    }));
    res.status(200).json(popularMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch popular movies from TMDb' });
  }
};

// Get categories and preferences (requires authentication)
const getCategories = (req, res) => {
  const user = isAuthenticated(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const preferences = userPreferences[user.id] || [];
  res.status(200).json({ categories: allCategories, preferences });
};

// Set user preferences (requires authentication)
const setPreferences = (req, res) => {
  const user = isAuthenticated(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const { preferences } = req.body;
  userPreferences[user.id] = preferences || [];
  res.status(200).json({ message: 'Preferences updated successfully.', preferences });
};

module.exports = { getMovies, getCategories, setPreferences };
