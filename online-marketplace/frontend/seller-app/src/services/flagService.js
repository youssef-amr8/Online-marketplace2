// Seller app flag service
import { apiRequest } from '../utils/api';

export const flagBuyer = async (buyerId, reason, orderId = null) => {
  try {
    const response = await apiRequest('/flags', {
      method: 'POST',
      body: JSON.stringify({
        reportedUserId: buyerId,
        reporterModel: 'Seller',
        reportedUserModel: 'Buyer',
        orderId: orderId,
        reason: reason
      })
    });
    return response.data;
  } catch (error) {
    console.error('Error flagging buyer:', error);
    throw error;
  }
};

