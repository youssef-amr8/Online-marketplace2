// Simple API utility for seller app
// For Vite, use import.meta.env, but we'll use a fallback for compatibility
// Use localhost explicitly for local development to avoid hostname resolution issues
const BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `http://${window.location.hostname}:3000`);

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('seller_token');

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

  const fullUrl = `${BASE_URL}/api${endpoint}`;
  console.log(`🌐 API Request: ${config.method || 'GET'} ${fullUrl}`);

  let response;
  try {
    response = await fetch(fullUrl, config);
  } catch (networkError) {
    // Handle network errors (backend not running, CORS issues, etc.)
    console.error('❌ Network error:', networkError);
    console.error(`Failed to connect to: ${fullUrl}`);
    console.error('Make sure the backend server is running on port 3000');
    const error = new Error('Cannot connect to server. Please make sure the backend is running on port 3000.');
    error.response = {
      data: { message: 'Cannot connect to server. Please make sure the backend is running on port 3000.' },
      status: 0
    };
    throw error;
  }

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

