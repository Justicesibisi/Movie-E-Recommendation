import React, { useState, useEffect } from 'react';
import tmdbService from '../api/tmdbService';
import '../styles.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await tmdbService.getMovies();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            }
        };

        // Check login status
        const token = localStorage.getItem('token'); // Matching App.js token key
        setLoggedIn(!!token);

        fetchMovies();
    }, []);

    useEffect(() => {
        if (loggedIn) {
            const fetchCategories = async () => {
                try {
                    const data = await tmdbService.getCategories();
                    setCategories(data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchCategories();
        }
    }, [loggedIn]);

    const truncateDescription = (description, length) => {
        if (description.length <= length) return description;
        return description.substring(0, length) + '...';
    };

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDownload = (movieTitle) => {
        if (!loggedIn) {
            alert('Please log in to download movies.');
            return;
        }
        // Simulate download functionality
        alert(`Downloading "${movieTitle}"...`);
    };

    return (
        <div className="main-content">
            <h1>Featured Movies</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="movies">
                {movies.map((movie) => (
                    <div className="movie" key={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        <div className="movie-details">
                            <h3>{movie.title}</h3>
                            <p>
                                {expandedDescriptions[movie.id]
                                    ? movie.description
                                    : truncateDescription(movie.description || 'No description available', 80)}
                                {movie.description && movie.description.length > 80 && (
                                    <span
                                        className="read-more"
                                        onClick={() => toggleDescription(movie.id)}
                                    >
                                        {expandedDescriptions[movie.id] ? ' Show Less' : ' Read More'}
                                    </span>
                                )}
                            </p>
                            <div className="movie-actions">
                                <button
                                    className="btn-play-trailer"
                                    onClick={() =>
                                        window.open(`https://www.youtube.com/results?search_query=${movie.title}+trailer`, '_blank')
                                    }
                                >
                                    Play Trailer
                                </button>
                                <button
                                    className="btn-download"
                                    onClick={() => handleDownload(movie.title)}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!loggedIn ? (
                <p className="login-prompt">
                    Please <a href="/login" className="login-link">log in</a> to view personalized content and set your preferences.
                </p>
            ) : (
                <p className="login-prompt">
                    Welcome back! Check your <a href="/dashboard" className="login-link">Dashboard</a> for more.
                </p>
            )}
        </div>
    );
};

export default Home;
