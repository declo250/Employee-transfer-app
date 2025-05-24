import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
    // Fetch token from localStorage
    const token = localStorage.getItem('managerToken') || localStorage.getItem('token');
    
    // Decode the token if it exists
    let user = null;
    if (token) {
        try {
            const base64Url = token.split('.')[1]; // Extract payload
            const decodedPayload = JSON.parse(atob(base64Url)); // Decode payload
            user = decodedPayload;
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    }

    // Redirect to login if no token or user
    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // Check role if a requiredRole is provided
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/login" />;
    }

    return children; // Allow access to the route
};

export default PrivateRoute;
