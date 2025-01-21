import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PreferencesPrompt from '../components/PreferencesPrompt';
import '../styles.css';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [error, setError] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [moviePage, setMoviePage] = useState(1);
    const [tvShowPage, setTvShowPage] = useState(1);

    useEffect(() => {
        const fetchMedia = async (type, page, setMedia) => {
            try {
                const token = localStorage.getItem('token');
                setLoggedIn(!!token);

                const genreParam = preferences.length > 0 ? `&genres=${preferences.join(',')}` : '';
                const response = await axios.get(
                    `http://localhost:5000/api/movies/${type}?page=${page}${genreParam}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setMedia((prev) => [...prev, ...response.data]);
            } catch (err) {
                setError(`Failed to fetch ${type}: ${err.message}`);
            }
        };

        setMovies([]);
        setTvShows([]);
        setMoviePage(1);
        setTvShowPage(1);

        fetchMedia('movies', 1, setMovies);
        fetchMedia('tvshows', 1, setTvShows);
    }, [preferences]);

    useEffect(() => {
        if (moviePage > 1) {
            fetchMedia('movies', moviePage, setMovies);
        }
    }, [moviePage]);

    useEffect(() => {
        if (tvShowPage > 1) {
            fetchMedia('tvshows', tvShowPage, setTvShows);
        }
    }, [tvShowPage]);

    const handleSavePreferences = async (selectedGenres) => {
        setPreferences(selectedGenres);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/user/preferences',
                { genres: selectedGenres },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            setError('Failed to save preferences. Please try again.');
        }
    };

    const handleDownload = async (title) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/torrents/download',
                { query: title },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            const torrentData = response.data.torrents[0];
            window.open(torrentData.link, '_blank');
        } catch (err) {
            console.error('Error downloading:', err);
            alert('Failed to download. Please try again.');
        }
    };

    const renderMediaCards = (media) => {
        return media.map((item) => (
            <div className="media-card" key={item.id}>
                <img src={item.poster} alt={item.title} />
                <div className="media-details">
                    <h3>
                        {item.title} <span className="media-rating">⭐ {roundToNearestDecimal(item.rating)}</span>
                    </h3>
                    <p>{truncateDescription(item.description, 100)}</p>
                    <div className="media-actions">
                        <button
                            className="btn-play-trailer"
                            onClick={() =>
                                window.open(
                                    `https://www.youtube.com/results?search_query=${item.title}+trailer`,
                                    '_blank'
                                )
                            }
                        >
                            Play Trailer
                        </button>
                        <button className="btn-download" onClick={() => handleDownload(item.title)}>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="main-content">
            <h1>Dashboard</h1>
            {error && <p className="error-message">{error}</p>}

            <PreferencesPrompt onSavePreferences={handleSavePreferences} />

            <h2>Movies</h2>
            <div className="media-container">{renderMediaCards(movies)}</div>
            {movies.length >= moviePage * 20 && (
                <button className="btn-load-more" onClick={() => setMoviePage((prev) => prev + 1)}>
                    Load More Movies
                </button>
            )}

            <h2>TV Shows</h2>
            <div className="media-container">{renderMediaCards(tvShows)}</div>
            {tvShows.length >= tvShowPage * 20 && (
                <button className="btn-load-more" onClick={() => setTvShowPage((prev) => prev + 1)}>
                    Load More TV Shows
                </button>
            )}
        </div>
    );
};

export default Dashboard;

const truncateDescription = (description, length) => {
    if (!description) return '';
    return description.length <= length ? description : `${description.substring(0, length)}...`;
};

const roundToNearestDecimal = (num) => {
    return Math.round(num * 10) / 10;
};
