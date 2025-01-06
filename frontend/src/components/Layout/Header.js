import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles.css';


const Header = ({ isLoggedIn }) => {
    return (
        <header className="header">
            <h1 className="logo">Movie E-Recommendation</h1>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/logout">Logout</Link>
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
