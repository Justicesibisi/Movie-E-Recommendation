import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BackgroundSlideshow from './BackgroundSlideshow';
import tmdbService from './api/tmdbService';
import './styles.css';

function App() {
    const [user, setUser] = useState(null);
    const [popularMovies, setPopularMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [preferences, setPreferences] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
            // Load user data if available
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(prev => ({ ...prev, ...JSON.parse(userData) }));
            }
        }
    }, []);

    useEffect(() => {
        if (!user) {
            tmdbService.getMovies()
                .then((data) => setPopularMovies(data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    useEffect(() => {
        tmdbService.getCategories()
            .then((data) => {
                setCategories(data);
                const savedPrefs = JSON.parse(localStorage.getItem('preferences') || '[]');
                setPreferences(savedPrefs);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSetPreferences = (newPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem('preferences', JSON.stringify(newPreferences));
    };

    return (
        <Router>
            <BackgroundSlideshow />
            <Header user={user} setUser={setUser} />
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
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
