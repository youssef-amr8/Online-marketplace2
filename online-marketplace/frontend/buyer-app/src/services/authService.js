// src/services/authService.js
import api from './api';

const authService = {
    // Register a new buyer
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register/buyer', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login buyer
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login/buyer', { email, password });



            if (response.data.success && response.data.data.token) {
                // Store token
                localStorage.setItem('token', response.data.data.token);

                // Store user data for MarketPlace component
                const userData = {
                    ...response.data.data.user,
                    isAuthenticated: true,
                    type: response.data.data.user.role || 'buyer'
                };
                localStorage.setItem('user', JSON.stringify(userData));

                return response.data.data;
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            // Even if API call fails, remove token locally
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    },

    // Get current user (if needed)
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authService;
