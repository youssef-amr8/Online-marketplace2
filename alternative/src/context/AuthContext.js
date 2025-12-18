// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    console.log('🔐 AuthProvider - useEffect running');
    const token = localStorage.getItem('token');
    console.log('🔐 AuthProvider - Found token in localStorage:', !!token);
    
    if (token) {
      console.log('🔐 AuthProvider - Setting isAuthenticated to true');
      setIsAuthenticated(true);
      setUser({ username: 'user' });
    } else {
      console.log('🔐 AuthProvider - No token found, user is not authenticated');
    }
    
    setLoading(false);
    console.log('🔐 AuthProvider - Loading set to false');
  }, []);

  const login = async (username, password) => {
    console.log('🔐 AuthProvider - login called with:', username);
    try {
      // Mock login for now
      console.log('🔐 AuthProvider - Starting mock login...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (username && password) {
        const token = 'mock-jwt-token-' + Date.now();
        console.log('🔐 AuthProvider - Login successful, token:', token);
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update state
        setIsAuthenticated(true);
        setUser({ username });
        
        console.log('🔐 AuthProvider - isAuthenticated set to true');
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('🔐 AuthProvider - Login failed:', error);
      return { 
        success: false, 
        error: 'Invalid username or password'
      };
    }
  };

  const logout = () => {
    console.log('🔐 AuthProvider - logout called');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  };

  console.log('🔐 AuthProvider - Rendering with state:', { isAuthenticated, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};