// Seller app order service
import { apiRequest } from '../utils/api';

export const getSellerOrders = async () => {
  try {
    const response = await apiRequest('/orders/seller');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

