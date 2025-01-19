import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import MoviesAndShows from './pages/MoviesAndShows'; // Import the new page
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import axios from 'axios';
import './styles.css';

function App() {
    const [user, setUser] = useState(null);
    const [popularMovies, setPopularMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [preferences, setPreferences] = useState([]);

    useEffect(() => {
        if (!user) {
            axios.get('/api/movies')
                .then((res) => setPopularMovies(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            axios.get('/api/movies/categories')
                .then((res) => {
                    setCategories(res.data.categories);
                    setPreferences(res.data.preferences);
                })
                .catch((err) => console.error(err));
        }
    }, []);

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
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movies-and-shows"
                    element={
                        <ProtectedRoute user={user}>
                            <MoviesAndShows />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;