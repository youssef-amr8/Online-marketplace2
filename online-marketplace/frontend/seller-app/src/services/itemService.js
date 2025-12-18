// Seller app item service
import { apiRequest } from '../utils/api';

export const getSellerItems = async (page = 1, limit = 20) => {
  try {
    const response = await apiRequest(`/items/seller?page=${page}&limit=${limit}`);
    return response.data || { items: [], count: 0 };
  } catch (error) {
    console.error('Error fetching seller items:', error);
    return { items: [], count: 0 };
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await apiRequest(`/items/${itemId}`, {
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createItem = async (itemData) => {
  try {
    // Convert image file to base64 or use URL if it's already a URL
    let imageUrl = '';
    if (itemData.image) {
      if (typeof itemData.image === 'string') {
        imageUrl = itemData.image;
      } else if (itemData.image instanceof File) {
        // Convert file to base64 for storage
        imageUrl = await fileToBase64(itemData.image);
      }
    }

    const payload = {
      title: itemData.name,
      description: itemData.description || '',
      category: itemData.category || '',
      price: parseFloat(itemData.price),
      stock: parseInt(itemData.stock) || 1,
      images: imageUrl ? [imageUrl] : []
    };

    const response = await apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return response;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    // Convert image file to base64 if provided
    let imageUrl = '';
    if (itemData.image) {
      if (typeof itemData.image === 'string') {
        imageUrl = itemData.image;
      } else if (itemData.image instanceof File) {
        imageUrl = await fileToBase64(itemData.image);
      }
    }

    const payload = {
      title: itemData.name,
      description: itemData.description || '',
      category: itemData.category || '',
      price: parseFloat(itemData.price),
      stock: parseInt(itemData.stock) || 1,
      ...(imageUrl ? { images: [imageUrl] } : {})
    };

    const response = await apiRequest(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    return response;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

