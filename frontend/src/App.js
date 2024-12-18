import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';  // Import ProtectedRoute
import './styles.css';

function App() {
    const [user, setUser] = useState(null);  // State to track logged-in user

    useEffect(() => {
        // Check if a JWT token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // If a token exists, set the user state (you could fetch user data here if needed)
            setUser({ token });
        }
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
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
