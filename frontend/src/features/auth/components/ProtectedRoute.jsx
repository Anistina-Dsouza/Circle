import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component that redirects unauthenticated users to the login page.
 * It checks for the presence of a 'token' in localStorage.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        // User not logged in or session incomplete, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // User is logged in, render the protected component
    return children;
};

export default ProtectedRoute;