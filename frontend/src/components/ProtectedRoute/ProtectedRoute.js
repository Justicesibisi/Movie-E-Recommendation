import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    // Check if there is no user (i.e., no JWT token)
    if (!user) {
        // Redirect to login page if no user is logged in
        return <Navigate to="/login" />;
    }

    // If user exists, allow access to the protected route
    return children;
};

export default ProtectedRoute;
