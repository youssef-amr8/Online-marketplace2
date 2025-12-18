// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🔐 ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🔐 ProtectedRoute - loading:', loading);
  console.log('🔐 ProtectedRoute - token in localStorage:', localStorage.getItem('token'));

  if (loading) {
    console.log('🔐 ProtectedRoute - Showing loading state');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('🔐 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔐 ProtectedRoute - User is authenticated, rendering children');
  return children;
};

export default ProtectedRoute;