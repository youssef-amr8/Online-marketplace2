// src/services/productService.js
import api from './api';

// Helper to get buyer's city from localStorage
const getBuyerCity = () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        return storedUser.city || 'Cairo'; // Default to Cairo
    } catch {
        return 'Cairo';
    }
};

const productService = {
    // Get all products with optional filters - now filters by buyer's city
    getProducts: async (filters = {}) => {
        try {
            const city = getBuyerCity();

            // Use by-location endpoint for city-based filtering
            const response = await api.post('/items/by-location', {
                city: city,
                category: filters.category || undefined,
                page: filters.page || 1,
                limit: filters.limit || 50
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching products by location:', error);
            // Fallback to regular listing if by-location fails
            try {
                const params = new URLSearchParams();
                if (filters.category) params.append('category', filters.category);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);
                if (filters.q) params.append('q', filters.q);

                const fallbackResponse = await api.get(`/items?${params.toString()}`);
                return fallbackResponse.data.data;
            } catch (fallbackError) {
                throw fallbackError;
            }
        }
    },

    // Get single product by ID (no city filtering needed for single product view)
    getProductById: async (id) => {
        try {
            const response = await api.get(`/items/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get products by category - now filters by buyer's city
    getProductsByCategory: async (category, page = 1, limit = 20) => {
        try {
            const city = getBuyerCity();
            const response = await api.post('/items/by-location', {
                city: city,
                category: category,
                page: page,
                limit: limit
            });
            return response.data.data;
        } catch (error) {
            // Fallback to regular endpoint
            const fallbackResponse = await api.get(`/items?category=${category}&page=${page}&limit=${limit}`);
            return fallbackResponse.data.data;
        }
    },

    // Search products (search doesn't filter by city for broader results)
    searchProducts: async (query, page = 1, limit = 20) => {
        try {
            const response = await api.get(`/items?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default productService;

