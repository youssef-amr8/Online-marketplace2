// src/services/productService.js
import api from './api';

const productService = {
    // Get all products with optional filters
    getProducts: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.category) params.append('category', filters.category);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.q) params.append('q', filters.q);

            const response = await api.get(`/items?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single product by ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/items/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get products by category
    getProductsByCategory: async (category, page = 1, limit = 20) => {
        try {
            const response = await api.get(`/items?category=${category}&page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Search products
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
