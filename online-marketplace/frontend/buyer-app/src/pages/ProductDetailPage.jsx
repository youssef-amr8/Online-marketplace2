// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { categories } from "../data/categories";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import commentService from "../services/commentService";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { fetchProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Try to fetch from backend first
        const fetchedProduct = await fetchProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          fetchComments(productId); // Use productId directly (MongoDB _id)
        } else {
          // Product not found - show error but don't redirect immediately
          console.warn('Product not found:', productId);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        // Don't redirect on error - let user see the error or stay on page
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, navigate, fetchProductById]);

  const fetchComments = async (itemId) => {
    setLoadingComments(true);
    try {
      // Try to fetch from API - if productId is MongoDB ObjectId format, use it directly
      // Otherwise, we might need to convert or use a different identifier
      const fetchedComments = await commentService.getCommentsByItemId(itemId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // If API fails, fall back to empty array
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      // Use productId - if it's a MongoDB ObjectId, use it directly
      // Otherwise, you might need to map it to the actual item ID
      const newComment = await commentService.addComment(
        productId,
        commentText,
        commentRating
      );
      
      // Add the new comment to the list
      setComments([newComment, ...comments]);
      setCommentText("");
      setCommentRating(5);
      setShowCommentForm(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to submit comment";
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
        alert("Cannot connect to server. Please make sure the backend is running on port 3000.");
      } else {
        alert(`Failed to submit comment: ${errorMsg}`);
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star filled">
          ★
        </span>
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }
    return stars;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-EG");
  };

  const calculateSavings = () => {
    if (product.originalPrice > product.price) {
      return product.originalPrice - product.price;
    }
    return 0;
  };

  const calculateDiscount = () => {
    if (product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }


  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : ['https://via.placeholder.com/400'];

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/marketplace">Home</Link>
        <span> › </span>
        {product.category && (
          <>
            <Link to={`/category/${product.category}`}>{product.category}</Link>
            <span> › </span>
          </>
        )}
        <span>{product.name}</span>
      </div>

      {/* Success Message */}
      {showAddedMessage && (
        <div className="added-to-cart-message">
          <div className="message-content">
            <span className="check-icon">✓</span>
            <span>Added to Cart</span>
          </div>
        </div>
      )}

      <div className="product-detail-container">
        {/* Images Section */}
        <div className="product-images-section">
          <div className="image-thumbnails">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? "active" : ""
                  }`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <img src={productImages[selectedImage]} alt={product.name} />
            {!product.inStock && (
              <div className="out-of-stock-overlay">
                <span>Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-brand">
            Visit the <span className="brand-link">{product.brand}</span> Store
          </div>

          <div className="product-rating-row">
            <div className="rating-stars">{renderStars(product.rating)}</div>
            <span className="rating-number">{product.rating}</span>
            <span className="divider">|</span>
            <span className="review-count">
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="divider-line"></div>

          {/* Price Section */}
          <div className="price-section">
            {calculateDiscount() > 0 && (
              <div className="discount-badge">-{calculateDiscount()}%</div>
            )}
            <div className="price-row">
              <span className="price-label">Price:</span>
              <span className="current-price">
                EGP {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <div className="original-price-row">
                <span className="price-label">List Price:</span>
                <span className="original-price">
                  EGP {formatPrice(product.originalPrice)}
                </span>
              </div>
            )}
            {calculateSavings() > 0 && (
              <div className="savings-row">
                You Save: EGP {formatPrice(calculateSavings())} (
                {calculateDiscount()}%)
              </div>
            )}
          </div>

          <div className="divider-line"></div>

          {/* Product Description */}
          <div className="product-description">
            <h3>About this item</h3>
            <ul>
              <li>{product.description}</li>
              <li>Brand: {product.brand}</li>
              <li>
                {product.inStock
                  ? "✓ In Stock - Ready to Ship"
                  : "✗ Currently Out of Stock"}
              </li>
              <li>{product.delivery}</li>
            </ul>
          </div>
        </div>

        {/* Purchase Section */}
        <div className="product-purchase-section">
          <div className="purchase-box">
            <div className="price-display">
              <span className="price">EGP {formatPrice(product.price)}</span>
            </div>

            <div className="delivery-info-box">
              <div className="delivery-row">
                <span className="delivery-icon">🚚</span>
                <span>{product.delivery}</span>
              </div>
              <div className="delivery-row">
                <span className="location-icon">📍</span>
                <span>Deliver to Egypt</span>
              </div>
            </div>

            <div className="stock-status">
              {product.inStock ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </button>

            <div className="secure-transaction">
              <span className="lock-icon">🔒</span>
              <span>Secure transaction</span>
            </div>

            <div className="seller-info">
              <div className="info-row">
                <span className="label">Ships from</span>
                <span className="value">Atlantica</span>
              </div>
              <div className="info-row">
                <span className="label">Sold by</span>
                <span className="value">{product.brand}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Reviews Section */}
        <div className="product-reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {isAuthenticated && (
              <button
                className="btn-add-review"
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                {showCommentForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Comment Form */}
          {showCommentForm && isAuthenticated && (
            <div className="comment-form-container">
              <form onSubmit={handleSubmitComment} className="comment-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating:</label>
                  <select
                    id="rating"
                    value={commentRating}
                    onChange={(e) => setCommentRating(parseInt(e.target.value))}
                    className="rating-select"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Your Review:</label>
                  <textarea
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows="5"
                    className="comment-textarea"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-submit-comment"
                  disabled={submittingComment || !commentText.trim()}
                >
                  {submittingComment ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {!isAuthenticated && (
            <p className="login-prompt">
              <Link to="/login">Log in</Link> to write a review
            </p>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="loading-comments">
              <p>Loading reviews...</p>
            </div>
          ) : comments.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="reviews-list">
              {comments.map((comment) => (
                <div key={comment._id || comment.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author-avatar">
                      {comment.buyerId?.name
                        ? comment.buyerId.name.charAt(0).toUpperCase()
                        : comment.buyerId?.email
                        ? comment.buyerId.email.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="review-author">
                      {comment.buyerId?.name || comment.buyerId?.email || "Anonymous"}
                    </span>
                  </div>
                  <div className="review-rating">
                    {renderStars(comment.rating || 5)}
                  </div>
                  <div className="review-meta">
                    Reviewed on{" "}
                    {new Date(comment.createdAt || comment.date).toLocaleDateString()}
                  </div>
                  <p className="review-text">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default ProductDetailPage;
