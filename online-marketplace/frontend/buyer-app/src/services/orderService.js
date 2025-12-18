// src/services/orderService.js
import api from './api';

const orderService = {
    // Create a new order
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get buyer's orders
    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Update order status (for sellers, but keeping for completeness)
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.patch(`/orders/${orderId}/status`, { status });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default orderService;
