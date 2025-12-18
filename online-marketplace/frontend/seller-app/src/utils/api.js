// Simple API utility for seller app
// For Vite, use import.meta.env, but we'll use a fallback for compatibility
const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    credentials: 'include',
  };

  const config = {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers
    }
  };

  const response = await fetch(`${BASE_URL}/api${endpoint}`, config);
  
  let responseData;
  try {
    responseData = await response.json();
  } catch (parseError) {
    // If JSON parsing fails, create error response
    const errorMessage = response.statusText || 'Request failed';
    const error = new Error(errorMessage);
    error.response = { data: { message: errorMessage }, status: response.status };
    throw error;
  }
  
  if (!response.ok || !responseData.success) {
    const errorMessage = responseData.message || responseData.error || response.statusText || 'Request failed';
    const error = new Error(errorMessage);
    error.response = { data: responseData, status: response.status };
    throw error;
  }

  return responseData;
};

export const getCommentsByItemId = async (itemId) => {
  try {
    const response = await apiRequest(`/comments/item/${itemId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

