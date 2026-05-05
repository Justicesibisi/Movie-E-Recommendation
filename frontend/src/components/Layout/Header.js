import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles.css';

const Header = ({ user, setUser }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="header">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="logo">
                    <span className="logo-white">M</span>ovie <span className="logo-white">E</span>-<span className="logo-white">R</span>ecommendation
                </h1>
            </Link>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className="btn-logout" style={{ background: 'none', border: 'none', color: '#f5f5f5', cursor: 'pointer', fontSize: '16px', padding: '8px 12px' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
