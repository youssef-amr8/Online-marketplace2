import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        // Feedback via simple console log or UI toast if available, but avoiding alert as requested
        console.log(`Added ${product.name} to cart`);
    };

    const isOutOfStock = !product.inStock || product.stock === 0;

    return (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div className="product-card">
                <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-card-image" />
                    {isOutOfStock && (
                        <div className="out-of-stock-badge">
                            <span>Out of Stock</span>
                        </div>
                    )}
                </div>
                <div className="product-card-info">
                    <h3 className="product-card-title">{product.name}</h3>

                    <div className="product-card-rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-count">({product.reviewCount || 0})</span>
                    </div>

                    <div className="product-card-price">
                        <span className="current-price">${product.price.toLocaleString()}</span>
                        {product.discount > 0 && (
                            <span className="old-price">
                                ${Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button 
                        className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`} 
                        onClick={handleAddToCart} 
                        title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        disabled={isOutOfStock}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
