import React, { useState } from 'react';
import '../styles.css';

const PreferencesPrompt = ({ onSavePreferences }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleSave = () => {
        onSavePreferences(selectedGenres);
    };

    const toggleGenre = (genre) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance'];

    return (
        <div className="preferences-prompt">
            <h2>Select Your Preferences</h2>
            <div className="genres-list">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={selectedGenres.includes(genre) ? 'selected' : ''}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <button onClick={handleSave}>Save Preferences</button>
        </div>
    );
};

export default PreferencesPrompt;
