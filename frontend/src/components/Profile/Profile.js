import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null); // Logged-in user data
    const [preferences, setPreferences] = useState({
        genres: [],
        language: '',
    }); // User preferences
    const [availableGenres, setAvailableGenres] = useState([]); // Static genres list
    const [successMessage, setSuccessMessage] = useState(''); // Success message
    const navigate = useNavigate(); // For navigation

    // Fetch user data and preferences
    useEffect(() => {
        const fetchUserData = () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Mock user data from token or storage
            const mockUser = JSON.parse(localStorage.getItem('user') || '{"username": "Guest User", "email": "guest@example.com"}');
            const savedPrefs = JSON.parse(localStorage.getItem('preferences') || '{"genres": [], "language": "English"}');

            setUser(mockUser);
            setPreferences(savedPrefs);
        };

        fetchUserData();
    }, [navigate]);

    // Set available genres
    useEffect(() => {
        setAvailableGenres(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi']);
    }, []);

    // Handle form submission to update preferences
    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('preferences', JSON.stringify(preferences));
        setSuccessMessage('Preferences updated successfully!');
    };

    // Handle input changes for preferences
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: value });
    };

    // Handle genre checkbox changes
    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        setPreferences((prev) => ({
            ...prev,
            genres: checked
                ? [...prev.genres, value]
                : prev.genres.filter((genre) => genre !== value),
        }));
    };

    return (
        <div className="profile-container">
            {user ? (
                <>
                    <h2>Welcome, {user.username}</h2>
                    <p>Email: {user.email}</p>
                    <form onSubmit={handleSubmit}>
                        <h3>Select Your Favorite Genres</h3>
                        {availableGenres.map((genre) => (
                            <div key={genre}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={genre}
                                        checked={preferences.genres.includes(genre)}
                                        onChange={handleGenreChange}
                                    />
                                    {genre}
                                </label>
                            </div>
                        ))}
                        <h3>Select Language</h3>
                        <select name="language" value={preferences.language} onChange={handleChange}>
                            <option value="">Select a language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                        </select>
                        <button type="submit">Save Preferences</button>
                    </form>
                    {successMessage && <p>{successMessage}</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
