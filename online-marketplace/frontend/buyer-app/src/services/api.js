// src/services/api.js

// Always use localhost:3000 for backend API, regardless of frontend port
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:3000/api`;

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const defaults = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
    };

    // Handle query parameters if they exist
    let url = `${API_URL}${endpoint}`;
    if (options.params) {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
    }

    const config = {
        ...defaults,
        ...options,
        headers: {
            ...defaults.headers,
            ...options.headers
        }
    };

    // Remove axios-specific properties that fetch doesn't support
    delete config.params;

    let response;
    try {
        response = await fetch(url, config);
    } catch (networkError) {
        console.error('Network error:', networkError);
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 3000.');
    }

    if (!response.ok) {
        // Handle 401 Unauthorized globally
        if (response.status === 401) {
            localStorage.removeItem('token');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: response.statusText };
        }

        // Construct an error object similar to Axios error.response
        const error = new Error(errorData.message || errorData.error || 'An error occurred');
        error.response = {
            data: errorData,
            status: response.status,
            statusText: response.statusText
        };
        throw error;
    }

    // Success
    const data = await response.json();

    // Return object mimicking axios response structure
    return {
        data: data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    };
};

const api = {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
