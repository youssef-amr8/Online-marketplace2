// src/pages/CartPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return price.toLocaleString("en-EG");
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart to see them here</p>
          <Link to="/marketplace" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                </div>

                <div className="item-details">
                  <Link to={`/product/${item.id}`} className="item-name">
                    {item.name}
                  </Link>

                  <p className="item-stock">
                    {item.inStock ? (
                      <span className="in-stock">In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </p>
                  <p className="item-delivery">{item.delivery}</p>

                  <div className="item-actions">
                    <div className="quantity-selector">
                      <label>Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <span className="price">EGP {formatPrice(item.price)}</span>
                  {item.originalPrice > item.price && (
                    <span className="original-price">
                      EGP {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="subtotal">
              <span>Subtotal ({cartItems.length} items):</span>
              <span className="total-price">
                EGP {formatPrice(getCartTotal())}
              </span>
            </div>
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="cart-summary-section">
          <div className="summary-box">
            <div className="summary-subtotal">
              <span>
                Subtotal (
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items):
              </span>
              <span className="summary-price">
                EGP {formatPrice(getCartTotal())}
              </span>
            </div>

            <button
              className="proceed-checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <div className="benefits-list">
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>FREE Delivery on orders over EGP 500</span>
              </div>
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Secure transaction</span>
              </div>
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Easy returns within 30 days</span>
              </div>
            </div>
          </div>

          <Link to="/marketplace" className="continue-shopping-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
