const jwt = require('jsonwebtoken');
const axios = require('axios');

// Mock data for demonstration purposes
const allCategories = ['Action', 'Drama', 'Comedy', 'Thriller'];
const userPreferences = {};

// Middleware function to verify tokens
const isAuthenticated = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message); // Debug log for token errors
    return null;
  }
};

// Get popular movies (accessible to everyone)
const getMovies = async (req, res) => {
  const { genres, page = 1 } = req.query;

  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/movie',
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          page,
          with_genres: genres,
        },
      }
    );

    const movies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      description: movie.overview,
      category: movie.genre_ids[0],
    }));

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies from TMDb' });
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

  if (!preferences || !Array.isArray(preferences)) {
    return res
      .status(400)
      .json({ error: 'Invalid preferences. Provide an array of categories.' });
  }

  const invalidCategories = preferences.filter(
    (pref) => !allCategories.includes(pref)
  );
  if (invalidCategories.length > 0) {
    return res.status(400).json({
      error: `Invalid categories: ${invalidCategories.join(
        ', '
      )}. Allowed categories are ${allCategories.join(', ')}.`,
    });
  }

  userPreferences[user.id] = preferences;
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
      category: movie.genre_ids[0],
    }));
    res.status(200).json(recommendedMovies);
  } catch (error) {
    console.error('Error fetching recommended movies:', error.message);
    res.status(500).json({
      error: 'Failed to fetch recommended movies from TMDb',
    });
  }
};

// Get TV shows (accessible to everyone)
const getTvShows = async (req, res) => {
  const { genres, page = 1 } = req.query;

  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/tv',
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          page,
          with_genres: genres,
        },
      }
    );

    const tvShows = response.data.results.map((show) => ({
      id: show.id,
      title: show.name,
      poster: `https://image.tmdb.org/t/p/w300${show.poster_path}`,
      description: show.overview,
      category: show.genre_ids[0],
    }));

    res.status(200).json(tvShows);
  } catch (error) {
    console.error('Error fetching TV shows:', error.message);
    res.status(500).json({ error: 'Failed to fetch TV shows from TMDb' });
  }
};

module.exports = {
  getMovies,
  getCategories,
  setPreferences,
  getRecommendedMovies,
  getTvShows,
};
