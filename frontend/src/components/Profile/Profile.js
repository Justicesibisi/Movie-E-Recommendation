import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState({
        genres: [],
        language: '',
    });
    const [availableGenres, setAvailableGenres] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data.user);
                setPreferences(response.data.user.preferences || { genres: [], language: '' });
            } catch (error) {
                console.error('Error fetching profile:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        setAvailableGenres(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi']);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                'http://localhost:5000/api/user/preferences',
                preferences,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMessage('Preferences updated successfully!');
        } catch (err) {
            console.error('Error updating preferences:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: value });
    };

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
