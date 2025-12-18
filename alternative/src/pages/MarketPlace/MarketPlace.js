import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const MarketPlace = () => {
  const [user, setUser] = useState(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselTrackRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const itemWidth = 225;
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();


  // Mock data
  const categories = [
    { id: 1, name: "Christmas Store", image: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "christmas" },
    { id: 2, name: "Installments & Discounts", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "installments" },
    { id: 3, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "beauty" },
    { id: 4, name: "Men's Fashion", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "men-fashion" },
    { id: 5, name: "Women's Fashion", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "women-fashion" },
    { id: 6, name: "Kids' Fashion", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "kids-fashion" },
    { id: 7, name: "Bestsellers", image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "bestsellers" },
    { id: 8, name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "home-kitchen" },
    { id: 9, name: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "mobiles" },
    { id: 10, name: "Televisions", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "televisions" },
    { id: 11, name: "Appliances", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "appliances" },
    { id: 12, name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "electronics" },
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.isAuthenticated && userData.type === 'buyer') {
      setUser(userData);
      
      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
    } else {
      // FIX: Now navigate can be called here
      navigate('/login');
    }
    
    setIsLoading(false);
  }, [navigate]); // Add navigate to dependencies


  const products = [
    { id: 1, name: "iPhone 15 Pro Max", category: "Mobiles", price: 999, oldPrice: 1299, discount: 30, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Samsung 65\" 4K Smart TV", category: "Televisions", price: 799, oldPrice: 999, discount: 25, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Premium Christmas Tree Set", category: "Christmas Store", price: 129, oldPrice: 199, discount: 40, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Winter Coat Collection", category: "Women's Fashion", price: 89, oldPrice: 129, discount: 35, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  ];

  const bannerItems = [
    { id: 1, title: "Flash Sale!", description: "Limited Time Offers", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Free Shipping", description: "On Orders Over $50", image: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Gift Cards", description: "Perfect Holiday Gifts", image: "https://images.unsplash.com/photo-1519452639340-7f0d4e49470e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  ];

  const installmentPlans = [
    { id: 1, title: "Basic Plan", description: "6 months installment with 0% interest for orders above $500" },
    { id: 2, title: "Standard Plan", description: "12 months installment with 5% interest for orders above $1000" },
    { id: 3, title: "Premium Plan", description: "24 months installment with 8% interest for orders above $2000" },
    { id: 4, title: "Luxury Plan", description: "36 months installment with 10% interest for orders above $5000" },
  ];

  // Initialize
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.isAuthenticated && userData.type === 'buyer') {
      setUser(userData);
      
      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
    } else {
      // Redirect to login project
      
     

        // Then use:
        navigate('/login');
    }
    
    setIsLoading(false);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Carousel control
  useEffect(() => {
    const track = carouselTrackRef.current;
    if (track) {
      if (isCarouselPaused) {
        track.style.animationPlayState = 'paused';
      } else {
        track.style.animationPlayState = 'running';
      }
    }
  }, [isCarouselPaused]);

  const handleCategoryClick = (categoryName) => {
    alert(`Navigating to ${categoryName} section...`);
  };

  const handlePrevClick = () => {
    setCurrentPosition(prev => {
      const newPosition = prev + itemWidth;
      if (newPosition > 0) {
        return -((categories.length - 1) * itemWidth);
      }
      return newPosition;
    });
  };

  const handleNextClick = () => {
    setCurrentPosition(prev => {
      const newPosition = prev - itemWidth;
      if (newPosition < -(categories.length * itemWidth)) {
        return 0;
      }
      return newPosition;
    });
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    alert(`${product.name} added to cart! Continue shopping or proceed to checkout.`);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = 'http://localhost:3000';
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (isLoading || !user) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading MarketPlace...</p>
      </div>
    );
  }

  return (
    <div className="MarketPlace">
      {/* Top Promotion Banner */}
      <div className="top-banner">
        <div className="container">
          <h1>UP TO 36 MONTH <span>INSTALLMENT PLANS & SPECIAL DISCOUNTS</span></h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        {/* User Info Bar */}
        <div className="user-info-bar">
          <div className="welcome-message">
            <i className="fas fa-user-circle"></i>
            Welcome back, <strong>{user.name}</strong>! 
            <span className="user-type">Buyer Account</span>
          </div>
          <div className="cart-section">
            <button className="cart-icon" onClick={() => setShowCart(!showCart)}>
              <i className="fas fa-shopping-cart"></i>
              {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Your Shopping Cart</h3>
              <button className="close-cart" onClick={() => setShowCart(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <i className="fas fa-shopping-cart"></i>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p>${item.price} × {item.quantity} = <strong>${item.price * item.quantity}</strong></p>
                      </div>
                      <button 
                        className="remove-item" 
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <button className="checkout-btn">
                <i className="fas fa-credit-card"></i> Proceed to Checkout
              </button>
              <button className="continue-shopping" onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Holiday Cheer Section */}
        <section className="holiday-section">
          <h2 className="holiday-title">GET READY FOR SOME <span>holiday cheer!</span></h2>
          <div className="cta-buttons">
            <button className="cta-button learn-more-btn">
              <i className="fas fa-info-circle"></i> LEARN MORE
            </button>
            <button className="cta-button shop-now-btn">
              <i className="fas fa-shopping-cart"></i> SHOP NOW
            </button>
          </div>
        </section>

        {/* Main Navigation */}
        <nav className="main-nav">
          <div className="container nav-container">
            <div className="logo">HOLIDAY<span>STORE</span></div>
            <ul className="nav-menu">
              {categories.map(cat => (
                <li key={cat.id}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick(cat.name); }}>
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-icons">
              <a href="#"><i className="fas fa-search"></i></a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowCart(!showCart); }}>
                <i className="fas fa-shopping-cart"></i>
                {getCartCount() > 0 && <span className="mini-cart-count">{getCartCount()}</span>}
              </a>
            </div>
          </div>
        </nav>

        {/* Rotating Categories Section */}
        <section className="rotating-categories-section">
          <h2 className="section-title">Shop By Category</h2>
          
          <div className="rotating-carousel">
            <div 
              className="carousel-track" 
              ref={carouselTrackRef}
              style={{ 
                animation: isCarouselPaused ? 'none' : `rotateCarousel 40s linear infinite`,
                transform: `translateX(${currentPosition}px)`
              }}
            >
              {[...categories, ...categories].map((cat, index) => (
                <div 
                  key={`${cat.id}-${index}`} 
                  className="category-card-rotating"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <img src={cat.image} alt={cat.name} className="category-image-rotating" />
                  <div className="category-name-rotating">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="carousel-controls">
            <button className="control-btn prev-btn" onClick={handlePrevClick}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className={`control-btn ${isCarouselPaused ? '' : 'pause-btn'}`} 
              onClick={() => setIsCarouselPaused(!isCarouselPaused)}
            >
              <i className={`fas ${isCarouselPaused ? 'fa-play' : 'fa-pause'}`}></i>
            </button>
            <button className="control-btn next-btn" onClick={handleNextClick}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="product-showcase">
          <h2 className="section-title">Featured Holiday Products</h2>
          <div className="product-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <div className="discount-badge">{product.discount}% OFF</div>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    ${product.price} <span className="old-price">${product.oldPrice}</span>
                  </div>
                  <button 
                    className="shop-now-btn" 
                    style={{padding: '8px 15px', fontSize: '14px', width: '100%'}}
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Banner Section */}
        <section className="featured-banner">
          {bannerItems.map(item => (
            <div className="banner-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="banner-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button 
                  className="shop-now-btn" 
                  style={{marginTop: '10px', padding: '8px 20px'}}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Installment Plans */}
       
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>MarketPlace</h3>
              <p>Your one-stop destination for holiday shopping with the best installment plans and discounts.</p>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Return Policy</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#">Track Your Order</a></li>
                <li><a href="#">My Account</a></li>
                <li><a href="#">Installment Plans</a></li>
                <li><a href="#">Gift Cards</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact Info</h3>
              <ul className="footer-links">
                <li><i className="fas fa-phone"></i> 1-800-HOLIDAY</li>
                <li><i className="fas fa-envelope"></i> support@holidaystore.com</li>
                <li><i className="fas fa-map-marker-alt"></i> 123 Shopping Street, Retail City</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2023 MarketPlace. All rights reserved. <span className="percent-sign">% % %</span> Special discounts available for a limited time.</p>
            <p className="logged-in-as">Logged in as: {user.email}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketPlace;