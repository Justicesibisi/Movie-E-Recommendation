import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('/api/movies/popular');
                setMovies(response.data.results); // Adjust based on your backend response structure
            } catch (error) {
                setError('Failed to load movies.');
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="main-content">
            <h1>Popular Movies</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="movies">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <div className="movie" key={movie.id}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                                <h3>{movie.title}</h3>
                                <a href={`/movies/${movie.id}`} className="btn-watch">
                                    Watch Now
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No movies to display.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
