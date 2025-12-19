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
    }
};

export default flagService;

