const jwt = require('jsonwebtoken');

// Existing mock data
const popularMovies = [
    { id: 1, title: 'Inception', poster: 'https://via.placeholder.com/200x300?text=Inception' },
    { id: 2, title: 'Interstellar', poster: 'https://via.placeholder.com/200x300?text=Interstellar' },
    { id: 3, title: 'The Dark Knight', poster: 'https://via.placeholder.com/200x300?text=The+Dark+Knight' },
];

const allCategories = ['Action', 'Drama', 'Comedy', 'Thriller'];
const userPreferences = {}; // Mock preferences per user (keyed by user ID)

// Middleware to check authentication
const isAuthenticated = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Get popular movies
const getMovies = (req, res) => {
    res.status(200).json(popularMovies);
};

// Get popular movies (mock implementation)
const getPopularMovies = (req, res) => {
    res.status(200).json(popularMovies);
};

// Get recommended movies (mock implementation)
const getRecommendedMovies = (req, res) => {
    // Mock implementation logic
    res.status(200).json(popularMovies); // Just returning popular movies for now
};

// Get categories and preferences
const getCategories = (req, res) => {
    const user = isAuthenticated(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const preferences = userPreferences[user.id] || [];
    res.status(200).json({ categories: allCategories, preferences });
};

// Set user preferences
const setPreferences = (req, res) => {
    const user = isAuthenticated(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const { preferences } = req.body;
    userPreferences[user.id] = preferences || [];
    res.status(200).json({ message: 'Preferences updated successfully.', preferences });
};

module.exports = {
    getMovies,
    getPopularMovies,
    getRecommendedMovies,
    getCategories,
    setPreferences,
};
