import React, { useState, useEffect } from 'react';
import tmdbService from './api/tmdbService';
import './styles.css';

const BackgroundSlideshow = () => {
    const [backdrops, setBackdrops] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBackdrops = async () => {
            try {
                const movies = await tmdbService.getTrending();
                const images = movies.filter(m => m.backdrop).map(m => m.backdrop);
                setBackdrops(images);
            } catch (err) {
                console.error('Failed to fetch slideshow backdrops', err);
            }
        };
        fetchBackdrops();
    }, []);

    useEffect(() => {
        if (backdrops.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % backdrops.length);
        }, 8000); // Change every 8 seconds
        return () => clearInterval(interval);
    }, [backdrops]);

    if (backdrops.length === 0) return null;

    return (
        <div className="background-slideshow">
            {backdrops.map((src, index) => (
                <div
                    key={src}
                    className={`slideshow-image ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}
            <div className="background-overlay" />
        </div>
    );
};

export default BackgroundSlideshow;
