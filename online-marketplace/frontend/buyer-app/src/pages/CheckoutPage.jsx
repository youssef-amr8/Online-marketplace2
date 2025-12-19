// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import "./CheckoutPage.css";

// Country data with phone codes and formats
const COUNTRIES = [
  { code: "EG", name: "Egypt", phoneCode: "+20", phoneLength: 10, flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", phoneCode: "+966", phoneLength: 9, flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", phoneCode: "+971", phoneLength: 9, flag: "🇦🇪" },
  { code: "US", name: "United States", phoneCode: "+1", phoneLength: 10, flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44", phoneLength: 10, flag: "🇬🇧" },
  { code: "FR", name: "France", phoneCode: "+33", phoneLength: 9, flag: "🇫🇷" },
  { code: "DE", name: "Germany", phoneCode: "+49", phoneLength: 10, flag: "🇩🇪" },
  { code: "IT", name: "Italy", phoneCode: "+39", phoneLength: 10, flag: "🇮🇹" },
  { code: "ES", name: "Spain", phoneCode: "+34", phoneLength: 9, flag: "🇪🇸" },
  { code: "TR", name: "Turkey", phoneCode: "+90", phoneLength: 10, flag: "🇹🇷" },
  { code: "JO", name: "Jordan", phoneCode: "+962", phoneLength: 9, flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", phoneCode: "+961", phoneLength: 8, flag: "🇱🇧" },
  { code: "KW", name: "Kuwait", phoneCode: "+965", phoneLength: 8, flag: "🇰🇼" },
  { code: "QA", name: "Qatar", phoneCode: "+974", phoneLength: 8, flag: "🇶🇦" },
  { code: "BH", name: "Bahrain", phoneCode: "+973", phoneLength: 8, flag: "🇧🇭" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "EG", // Default to Egypt
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return price.toLocaleString("en-EG");
  };

  const calculateShipping = () => {
    const subtotal = getCartTotal();
    return subtotal >= 500 ? 0 : 50; // Free shipping over 500 EGP
  };

  const calculateTax = () => {
    return getCartTotal() * 0.14; // 14% tax
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateShipping() + calculateTax();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const selectedCountry = COUNTRIES.find(c => c.code === formData.country);

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const expectedLength = selectedCountry.phoneLength;
      if (phoneDigits.length !== expectedLength) {
        newErrors.phone = `Phone number must be ${expectedLength} digits for ${selectedCountry.name}`;
      }
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to place an order");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }

    if (validateForm()) {
      setIsPlacingOrder(true);
      try {
        // Prepare items for backend (need itemId and quantity)
        const items = cartItems.map(item => ({
          itemId: item.id, // MongoDB _id
          quantity: item.quantity
        }));

        // Create order via backend API
        const order = await orderService.createOrder({ items });

        // Show success message
        alert(
          `Order placed successfully!\n\nOrder ID: ${order._id || order.id}\nOrder Total: EGP ${formatPrice(
            order.totalPrice || calculateTotal()
          )}\n\nYour order will be shipped in 3-6 business days.\n\nThank you for your purchase!`
        );

        // Clear cart and navigate to orders page
        clearCart();
        navigate("/orders");
      } catch (error) {
        console.error('Error placing order:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to place order';
        if (errorMsg.includes('Insufficient stock')) {
          alert(`Order failed: ${errorMsg}. Please update your cart.`);
          navigate("/cart");
        } else {
          alert(`Failed to place order: ${errorMsg}`);
        }
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <div className="empty-checkout-content">
          <div className="empty-checkout-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart before proceeding to checkout</p>
          <button onClick={() => navigate("/marketplace")} className="shop-now-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Checkout Form Section */}
        <div className="checkout-form-section">
          <h1>Checkout</h1>

          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? "error" : ""}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "error" : ""}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">
                    Country <span className="required">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={errors.country ? "error" : ""}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.phoneCode})
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <span className="error-message">{errors.country}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <div className="phone-input-wrapper">
                    <span className="phone-code">
                      {COUNTRIES.find(c => c.code === formData.country)?.phoneCode}
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "error" : ""}
                      placeholder={`${COUNTRIES.find(c => c.code === formData.country)?.phoneLength} digits`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Street Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? "error" : ""}
                  placeholder="Street address, apartment, suite, etc."
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? "error" : ""}
                    placeholder="City"
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">
                    Postal Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={errors.postalCode ? "error" : ""}
                    placeholder="12345"
                  />
                  {errors.postalCode && (
                    <span className="error-message">{errors.postalCode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  <div className="payment-details">
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-description">
                      Pay when you receive your order
                    </span>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                  />
                  <div className="payment-details">
                    <span className="payment-name">Credit/Debit Card</span>
                    <span className="payment-description">
                      Pay securely with your card
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={isPlacingOrder}>
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <div className="summary-box">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">
                    EGP {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>EGP {formatPrice(getCartTotal())}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `EGP ${formatPrice(calculateShipping())}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Tax (14%):</span>
                <span>EGP {formatPrice(calculateTax())}</span>
              </div>

              <div className="summary-row total">
                <span>Order Total:</span>
                <span className="total-price">
                  EGP {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            {calculateShipping() > 0 && (
              <div className="shipping-notice">
                <i className="fas fa-info-circle"></i>
                Add EGP {formatPrice(500 - getCartTotal())} more for FREE shipping
              </div>
            )}
          </div>

          <button onClick={() => navigate("/cart")} className="back-to-cart-btn">
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
