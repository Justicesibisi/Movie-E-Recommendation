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
      category: movie.genre_ids[0], // Assuming the first genre ID represents the category
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
  res.status(200).json({
    message: 'Preferences updated successfully.',
    preferences,
  });
};

// Get recommended movies based on user preferences (requires authentication)
const getRecommendedMovies = async (req, res) => {
  const user = isAuthenticated(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const preferences = userPreferences[user.id] || [];
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=${preferences.join(
        ','
      )}`
    );
    const recommendedMovies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      description: movie.overview,
      category: movie.genre_ids[0], // Assuming the first genre ID represents the category
    }));
    res.status(200).json(recommendedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch recommended movies from TMDb',
    });
  }
};

const getTvShows = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
    );
    const popularTvShows = response.data.results.map((show) => ({
      id: show.id,
      title: show.name,
      poster: `https://image.tmdb.org/t/p/w300${show.poster_path}`,
      description: show.overview,
      category: show.genre_ids[0], // Assuming the first genre ID represents the category
    }));
    res.status(200).json(popularTvShows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch popular TV shows from TMDb' });
  }
};

module.exports = {
  getMovies,
  getCategories,
  setPreferences,
  getRecommendedMovies,
  getTvShows,
};
