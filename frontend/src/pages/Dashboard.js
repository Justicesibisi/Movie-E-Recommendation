import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [moviePage, setMoviePage] = useState(1);
    const [tvShowPage, setTvShowPage] = useState(1);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    const fetchMedia = async (type, page, setMedia) => {
        try {
            const token = localStorage.getItem('token');
            setLoggedIn(!!token);

            const response = await axios.get(
                `http://localhost:5000/api/movies/${type}?page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMedia((prev) => {
                const newMedia = response.data.filter(item => !prev.some(existingItem => existingItem.id === item.id));
                return [...prev, ...newMedia];
            });
        } catch (err) {
            setError(`Failed to fetch ${type}. Reason: ${err.response?.data?.error || err.message}`);
        }
    };

    useEffect(() => {
        setMovies([]);
        setTvShows([]);
        setMoviePage(1);
        setTvShowPage(1);

        fetchMedia('movies', 1, setMovies);
        fetchMedia('tvshows', 1, setTvShows);
    }, []);

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
            alert('Download under construction. Please try again later.');
        }
    };

    const handleWhereToWatch = (title) => {
        window.open(
            `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`,
            '_blank'
        );
    };

    const truncateDescription = (description, length) => {
        if (!description) return '';
        return description.length <= length ? description : `${description.substring(0, length)}...`;
    };

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderMediaCards = (media) => {
        return media.map((item) => (
            <div className="media-card" key={item.id}>
                <img src={item.poster} alt={item.title} />
                <div className="media-details">
                    <h3>
                        {item.title}  
                    </h3>
                    <p>
                        {expandedDescriptions[item.id]
                            ? item.description
                            : truncateDescription(item.description || 'No description available', 100)}
                        {item.description && item.description.length > 100 && (
                            <span
                                className="read-more"
                                onClick={() => toggleDescription(item.id)}
                            >
                                {expandedDescriptions[item.id] ? ' Show Less' : ' Read More'}
                            </span>
                        )}
                    </p>
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
                        <button
                            className="btn-where-to-watch"
                            onClick={() => handleWhereToWatch(item.title)}
                        >
                            Where to Watch
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
