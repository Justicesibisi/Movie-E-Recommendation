const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

console.log("TMDB_API_KEY:", process.env.TMDB_API_KEY); // Log the API key

// Fetch popular movies
const getMovies = async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY; // Retrieve API key from .env file
        const url = `https://api.themoviedb.org/3/movie/popular`;
        const response = await axios.get(url, {
            params: {
                api_key: apiKey, // Pass API key as a parameter
                language: 'en-US',
                page: 1,
            },
        });
        res.status(200).json(response.data); // Send movie data to the frontend
    } catch (error) {
        console.error('Error fetching movies:', error); // Log any errors
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Internal Server Error',
        });
    }
};

module.exports = {
    getMovies,
};

// Fetch personalized recommendations
const getRecommendedMovies = async (req, res) => {
    try {
        const { userPreferences } = req.body; // Pass user preferences (e.g., genres)
        const genreIds = userPreferences.join(',');

        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: { api_key: API_KEY, with_genres: genreIds, language: 'en-US', page: 1 },
        });
        const movies = response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            overview: movie.overview,
            release_date: movie.release_date,
        }));
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

module.exports = {
    getMovies,
    getRecommendedMovies,
};
