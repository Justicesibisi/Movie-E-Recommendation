const User = require('../models/User'); // Import your User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios'); // Ensure axios is installed: npm install axios

// Fetch movies using TMDb API
const getMovies = async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );

        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        return res.status(200).json({ movies });
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
    const { genres, language } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.preferences = { genres, language };
        await user.save();
        res.status(200).json({ message: 'Preferences updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get recommended movies
const getRecommendedMovies = async (req, res) => {
    const { genres, language } = req.body; // Assume the user's preferences are sent in the request body
    const apiKey = process.env.TMDB_API_KEY;

    try {
        const genreString = genres.join(',');
        const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&with_genres=${genreString}`;

        const response = await axios.get(tmdbUrl);
        const movies = response.data.results;

        res.status(200).json({ message: 'Movies fetched successfully', movies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

// Get user by ID
async function getUserById(req, res) {
    const userId = req.params.id; // Extract user ID from the route parameter

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const user = await User.findById(userId); // Query your database
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Respond with user details (customize based on your model)
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            preferences: user.preferences,
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUserPreferences,
    getUserDetails,
    getRecommendedMovies,
    getMovies, // Added export for getMovies
    getUserById, // Added export for getUserById
};
