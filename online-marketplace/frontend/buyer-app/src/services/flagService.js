// src/services/flagService.js
import api from './api';

const flagService = {
    // Flag a seller
    flagSeller: async (sellerId, reason, orderId = null) => {
        try {
            const response = await api.post('/flags', {
                reportedUserId: sellerId,
                reporterModel: 'Buyer',
                reportedUserModel: 'Seller',
                orderId: orderId,
                reason: reason
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get flags I (buyer) have submitted
    getMyFlags: async () => {
        try {
            const response = await api.get('/flags/my-flags');
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get flags submitted against me (buyer)
    getFlagsAgainstMe: async () => {
        try {
            const response = await api.get('/flags/against-me');
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get flag count for a specific user
    getFlagCount: async (userId) => {
        try {
            const response = await api.get(`/flags/count/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default flagService;
