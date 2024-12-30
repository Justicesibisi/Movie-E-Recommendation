import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';
import API_BASE_URL from '../config';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/movies`);
                setMovies(response.data.results); // Assuming 'results' contains the movie array
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div>
            <h1>Popular Movies</h1>
            <div className="movies">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie">
                        <h3>{movie.title}</h3>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
