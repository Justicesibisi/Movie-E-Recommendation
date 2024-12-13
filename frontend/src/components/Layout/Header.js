import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <nav>
                <Link to="/" style={{ margin: '0 15px', color: 'white' }}>Home</Link>
                <Link to="/login" style={{ margin: '0 15px', color: 'white' }}>Login</Link>
                <Link to="/register" style={{ margin: '0 15px', color: 'white' }}>Register</Link>
                <Link to="/profile" style={{ margin: '0 15px', color: 'white' }}>Profile</Link>
            </nav>
        </header>
    );
}
