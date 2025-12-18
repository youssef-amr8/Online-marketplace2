// src/services/commentService.js
import api from './api';

const commentService = {
    // Get comments for a specific item
    getCommentsByItemId: async (itemId) => {
        try {
            const response = await api.get(`/comments/item/${itemId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Add a comment to an item
    addComment: async (itemId, text, rating, orderId = null) => {
        try {
            const response = await api.post('/comments', {
                itemId,
                text,
                rating,
                orderId
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default commentService;

