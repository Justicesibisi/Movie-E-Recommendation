import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import axios from 'axios';  // Import axios for API requests
import './styles.css';

function App() {
    const [user, setUser] = useState(null);  // State to track logged-in user
    const [popularMovies, setPopularMovies] = useState([]);  // Popular movies for non-logged-in users
    const [categories, setCategories] = useState([]);  // Categories for logged-in users
    const [preferences, setPreferences] = useState([]);  // Preferences for logged-in users

    // Fetch popular movies for not-logged-in users
    useEffect(() => {
        if (!user) {
            axios.get('/api/movies')
                .then((res) => setPopularMovies(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Check if a JWT token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch categories and preferences for logged-in users
            axios.get('/api/movies/categories')
                .then((res) => {
                    setCategories(res.data.categories);
                    setPreferences(res.data.preferences);
                })
                .catch((err) => console.error(err));
        }
    }, []);

    // Update user preferences
    const handleSetPreferences = (newPreferences) => {
        axios.post('/api/movies/preferences', { preferences: newPreferences })
            .then((res) => setPreferences(res.data.preferences))
            .catch((err) => console.error(err));
    };

    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            user={user}
                            popularMovies={popularMovies}
                            categories={categories}
                            preferences={preferences}
                            onUpdatePreferences={handleSetPreferences}
                        />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Protect the /profile route */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
