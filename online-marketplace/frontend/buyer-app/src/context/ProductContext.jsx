// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import productService from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useBackend, setUseBackend] = useState(true);

    // Fetch all products
    const fetchProducts = useCallback(async (filters = {}) => {
        // Always use backend - no mock data

        setLoading(true);
        setError(null);

        try {
            const data = await productService.getProducts(filters);

            // Transform backend data to match frontend structure
            const transformedProducts = {};

            if (data.items && Array.isArray(data.items)) {
                data.items.forEach(item => {
                    const category = item.category || 'uncategorized';

                    if (!transformedProducts[category]) {
                        transformedProducts[category] = [];
                    }

                    transformedProducts[category].push({
                        id: item._id,
                        name: item.title,
                        description: item.description,
                        price: item.price,
                        rating: item.avgRating || 0,
                        reviewCount: item.commentsCount || 0,
                        image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400',
                        images: item.images || [],
                        inStock: item.stock > 0,
                        stock: item.stock,
                        delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                        category: item.category,
                        brand: item.sellerId?.name || 'Brand',
                        // Serviceability Data
                        serviceCities: item.sellerId?.sellerProfile?.serviceCities || [],
                        sellerCity: item.sellerId?.sellerProfile?.city || '',
                        baseDeliveryFee: item.sellerId?.sellerProfile?.baseDeliveryFee || 50,
                        deliveryFeePerKm: item.sellerId?.sellerProfile?.deliveryFeePerKm || 10
                    });
                });
            }

            setProducts(transformedProducts);
            return transformedProducts;
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            // Don't fallback to mock data - return empty
            setProducts({});
            return {};
        } finally {
            setLoading(false);
        }
    }, [useBackend]);

    // Fetch products by category
    const fetchProductsByCategory = useCallback(async (category) => {
        // Always use backend - no mock data
        setLoading(true);
        setError(null);

        try {
            const data = await productService.getProductsByCategory(category);

            const transformedProducts = data.items.map(item => ({
                id: item._id,
                name: item.title,
                description: item.description,
                price: item.price,
                rating: item.avgRating || 0,
                reviewCount: item.commentsCount || 0,
                image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400',
                inStock: item.stock > 0,
                stock: item.stock,
                delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                category: item.category,
                brand: item.sellerId?.name || 'Brand',
                // Serviceability Data
                serviceCities: item.sellerId?.sellerProfile?.serviceCities || [],
                sellerCity: item.sellerId?.sellerProfile?.city || '',
                baseDeliveryFee: item.sellerId?.sellerProfile?.baseDeliveryFee || 50,
                deliveryFeePerKm: item.sellerId?.sellerProfile?.deliveryFeePerKm || 10
            }));

            return transformedProducts;
        } catch (err) {
            console.error('Error fetching products by category:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [useBackend]);

    // Fetch single product by ID
    const fetchProductById = useCallback(async (id) => {
        // Always use backend - no mock data

        setLoading(true);
        setError(null);

        try {
            const item = await productService.getProductById(id);

            if (!item) return null;

            return {
                id: item._id,
                name: item.title,
                description: item.description,
                price: item.price,
                rating: item.avgRating || 0,
                reviewCount: item.commentsCount || 0,
                image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400',
                images: item.images && item.images.length > 0 ? item.images : (item.images && item.images[0] ? [item.images[0]] : ['https://via.placeholder.com/400']),
                inStock: item.stock > 0,
                stock: item.stock,
                delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                category: item.category,
                seller: item.sellerId,
                sellerId: item.sellerId?._id || item.sellerId, // Store sellerId for easy access
                brand: item.sellerId?.name || 'Brand'
            };
        } catch (err) {
            console.error('Error fetching product by ID:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [useBackend]);

    // Search products
    const searchProducts = useCallback(async (query) => {
        // Always use backend - no mock data

        setLoading(true);
        setError(null);

        try {
            const data = await productService.searchProducts(query);

            const transformedProducts = data.items.map(item => ({
                id: item._id,
                name: item.title,
                description: item.description,
                price: item.price,
                rating: item.avgRating || 0,
                reviewCount: item.commentsCount || 0,
                image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400',
                inStock: item.stock > 0,
                stock: item.stock,
                delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                delivery: `Delivery in ${item.deliveryTimeEstimate || 3} days`,
                category: item.category,
                brand: item.sellerId?.name || 'Brand',
                // Serviceability Data
                serviceCities: item.sellerId?.sellerProfile?.serviceCities || [],
                sellerCity: item.sellerId?.sellerProfile?.city || '',
                baseDeliveryFee: item.sellerId?.sellerProfile?.baseDeliveryFee || 50,
                deliveryFeePerKm: item.sellerId?.sellerProfile?.deliveryFeePerKm || 10
            }));

            return transformedProducts;
        } catch (err) {
            console.error('Error searching products:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [useBackend]);

    // Load products on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const value = {
        products,
        loading,
        error,
        useBackend,
        setUseBackend,
        fetchProducts,
        fetchProductsByCategory,
        fetchProductById,
        searchProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
