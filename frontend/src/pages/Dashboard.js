import React, { useState, useEffect } from 'react';
import tmdbService from '../api/tmdbService';
import '../styles.css';

const Dashboard = () => {
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [error, setError] = useState('');
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [genres, setGenres] = useState([{ id: 'All', name: 'All' }]);
    const [selectedGenre, setSelectedGenre] = useState('All');

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const [trendingData, topRatedData, upcomingData, moviesData, tvShowsData, categories] = await Promise.all([
                    tmdbService.getTrending(),
                    tmdbService.getTopRated(),
                    tmdbService.getUpcoming(),
                    tmdbService.getMovies(),
                    tmdbService.getTvShows(),
                    tmdbService.getCategories()
                ]);

                setTrending(trendingData);
                setTopRated(topRatedData);
                setUpcoming(upcomingData);
                setMovies(moviesData);
                setTvShows(tvShowsData);
                setGenres([{ id: 'All', name: 'All' }, ...categories]);
            } catch (err) {
                setError(`Failed to fetch dashboard data: ${err.message}`);
            }
        };

        initDashboard();
    }, []);

    useEffect(() => {
        if (selectedGenre === 'All') {
            setFilteredMovies(movies);
        } else {
            const genreId = parseInt(selectedGenre);
            tmdbService.getMovies(genreId).then(data => setFilteredMovies(data));
        }
    }, [selectedGenre, movies]);

    const handleDownload = (title) => {
        alert(`Download for "${title}" is coming soon!`);
    };

    const handleWhereToWatch = (title) => {
        window.open(`https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`, '_blank');
    };

    const truncateDescription = (description, length) => {
        if (!description) return '';
        return description.length <= length ? description : `${description.substring(0, length)}...`;
    };

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const renderMediaCards = (media) => {
        return (
            <div className="media-container">
                {media.map((item) => (
                    <div className="media-card" key={item.id}>
                        <img src={item.poster} alt={item.title} />
                        <div className="media-details">
                            <h3>{item.title}</h3>
                            <p>
                                {expandedDescriptions[item.id]
                                    ? item.description
                                    : truncateDescription(item.description || 'No description available', 80)}
                                {item.description && item.description.length > 80 && (
                                    <span className="read-more" onClick={() => toggleDescription(item.id)}>
                                        {expandedDescriptions[item.id] ? ' Show Less' : ' Read More'}
                                    </span>
                                )}
                            </p>
                            <div className="media-actions">
                                <button className="btn-play-trailer" onClick={() => window.open(`https://www.youtube.com/results?search_query=${item.title}+trailer`, '_blank')}>
                                    Trailer
                                </button>
                                <button className="btn-download" onClick={() => handleDownload(item.title)}>
                                    Download
                                </button>
                                <button className="btn-where-to-watch" onClick={() => handleWhereToWatch(item.title)}>
                                    Watch
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="main-content dashboard-content">
            {error && <p className="error-message">{error}</p>}

            <div className="filter-container">
                <label htmlFor="genre-filter">Refine by Genre:</label>
                <select id="genre-filter" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            <section className="dashboard-section">
                <h2>Trending this Week</h2>
                {renderMediaCards(trending)}
            </section>

            <section className="dashboard-section">
                <h2>Top Rated Movies</h2>
                {renderMediaCards(topRated)}
            </section>

            <section className="dashboard-section">
                <h2>Upcoming Releases</h2>
                {renderMediaCards(upcoming)}
            </section>

            <section className="dashboard-section">
                <h2>Discover TV Shows</h2>
                {renderMediaCards(tvShows)}
            </section>
        </div>
    );
};

export default Dashboard;