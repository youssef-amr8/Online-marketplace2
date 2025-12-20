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

// Get flags I (seller) have submitted
export const getMyFlags = async () => {
  try {
    const response = await apiRequest('/flags/my-flags');
    return response.data;
  } catch (error) {
    console.error('Error getting my flags:', error);
    throw error;
  }
};

// Get flags submitted against me (seller)
export const getFlagsAgainstMe = async () => {
  try {
    const response = await apiRequest('/flags/against-me');
    return response.data;
  } catch (error) {
    console.error('Error getting flags against me:', error);
    throw error;
  }
};

// Get all flags (for admin/dashboard views)
export const getAllFlags = async (resolved = undefined, page = 1, limit = 20) => {
  try {
    let url = `/flags/all?page=${page}&limit=${limit}`;
    if (resolved !== undefined) {
      url += `&resolved=${resolved}`;
    }
    const response = await apiRequest(url);
    return response.data;
  } catch (error) {
    console.error('Error getting all flags:', error);
    throw error;
  }
};

// Get flag count for a specific user
export const getFlagCount = async (userId) => {
  try {
    const response = await apiRequest(`/flags/count/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting flag count:', error);
    throw error;
  }
};
