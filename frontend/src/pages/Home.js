import React, { useState, useEffect } from 'react';
import '../styles.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/movies/movies'); // API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            }
        };

        // Check login status
        const token = localStorage.getItem('authToken');
        setLoggedIn(!!token); // Set logged-in state based on token presence

        fetchMovies();
    }, []);

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

    const roundToNearestDecimal = (num) => {
        return Math.round(num * 10) / 10;
    };

    return (
        <div className="main-content">
            <h1>Popular Movies</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="movies">
                {movies.map((movie) => (
                    <div className="movie" key={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        <div className="movie-details">
                            <h3>{movie.title} <span className="movie-rating">⭐ {roundToNearestDecimal(movie.rating)}</span></h3>
                            <p>
                                {expandedDescriptions[movie.id]
                                    ? movie.description
                                    : truncateDescription(movie.description || 'No description available', 100)}
                                {movie.description && movie.description.length > 100 && (
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
                                <a
                                    href={`https://www.justwatch.com/us/search?q=${movie.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-where-to-watch"
                                >
                                    🎞️Where to Watch
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!loggedIn && (
                <p className="login-prompt">
                    Please <a href="/login" className="login-link">log in</a> to view personalized content and set your preferences.
                </p>
            )}
        </div>
    );
};

export default Home;