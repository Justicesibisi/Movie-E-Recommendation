import React, { useState, useEffect } from 'react';
import '../styles.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

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

    return (
        <div style={{ backgroundColor: '#1c1c1c', color: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ color: '#e50914', textAlign: 'center' }}>Popular Movies</h1>
            {error && <p style={{ color: '#e50914', textAlign: 'center' }}>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        style={{
                            width: '300px',
                            backgroundColor: '#333',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '10px' }}>
                            <h3 style={{ color: '#e50914', margin: '10px 0' }}>{movie.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                                {movie.description || 'No description available'}
                            </p>
                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    style={{
                                        backgroundColor: '#e50914',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        window.open(`https://www.youtube.com/results?search_query=${movie.title}+trailer`, '_blank')
                                    }
                                >
                                    Play Trailer
                                </button>
                                <span style={{ color: '#f5f5f5', fontWeight: 'bold' }}>
                                    ⭐ {movie.rating || 'N/A'}
                                </span>
                            </div>
                            <a
                                href={`https://www.justwatch.com/us/search?q=${movie.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#e50914', textDecoration: 'none', display: 'block', marginTop: '10px' }}
                            >
                                Where to Watch
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {!loggedIn && (
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '1rem', color: '#666' }}>
                    Please <a href="/login" style={{ color: '#e50914', textDecoration: 'none' }}>log in</a> to view personalized content and set your preferences.
                </p>
            )}
        </div>
    );
};

export default Home;
