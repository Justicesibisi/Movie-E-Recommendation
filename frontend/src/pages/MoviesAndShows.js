import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PreferencesPrompt from '../components/PreferencesPrompt';
import '../styles.css';

const MoviesAndShows = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchMoviesAndShows = async () => {
            try {
                const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: {
                        api_key: process.env.REACT_APP_TMDB_API_KEY,
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                    },
                });
                setMovies(response.data.results);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMoviesAndShows();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoggedIn(!!token);
    }, []);

    const handleSetPreferences = (newPreferences) => {
        setPreferences(newPreferences);
        // Save preferences to the backend if needed
    };

    const handleDownload = (movieTitle) => {
        window.open(`https://yts.mx/browse-movies/${encodeURIComponent(movieTitle)}`, '_blank');
    };

    return (
        <div className="main-content">
            <h1>Movies and TV Shows</h1>
            {error && <p className="error-message">{error}</p>}
            {loggedIn && <PreferencesPrompt onSavePreferences={handleSetPreferences} />}
            <div className="movies">
                {movies.map((movie) => (
                    <div className="movie" key={movie.id}>
                        <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                        <div className="movie-details">
                            <h3>{movie.title}</h3>
                            <p>{movie.overview}</p>
                            <button className="btn-download" onClick={() => handleDownload(movie.title)}>
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoviesAndShows;
