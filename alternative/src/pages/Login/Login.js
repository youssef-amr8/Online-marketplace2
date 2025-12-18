import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  // Mock users database
  const mockUsers = {
    buyer: [
      { email: 'test@test.com', password: 'test123', name: 'Test User' },
      { email: 'buyer@example.com', password: 'password123', name: 'John Buyer' }
    ],
    seller: [
      { email: 'seller@example.com', password: 'seller123', name: 'Jane Seller' }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleLogin = () => {
  setTimeout(() => {
    const users = mockUsers[userType];
    const user = users.find(u => 
      u.email === email.trim() && u.password === password
    );
    
    if (user) {
      // Store user info in localStorage
      const userData = {
        email: user.email,
        name: user.name,
        type: userType,
        isAuthenticated: true,
        token: 'mock-jwt-token-' + Date.now()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Login successful!');
      console.log('📦 User data:', userData);
      
      // IMPORTANT: Reset loading state BEFORE navigation
      setIsLoading(false);
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('🚀 Navigating to /marketplace...');
        navigate('/marketplace'); // Make sure this matches your App.js route
      }, 100);
      
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  }, 1000);
  };

  const handleSignup = () => {
    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Check if user already exists
      const existingUser = mockUsers[userType].find(u => u.email === email.trim());
      
      if (existingUser) {
        setError('User with this email already exists');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        email: email.trim(),
        password: password,
        name: fullName.trim()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: newUser.email,
        name: newUser.name,
        type: userType,
        isAuthenticated: true,
        token: 'new-user-token-' + Date.now()
      }));

      // Show success message
      alert(`Account created successfully! Welcome ${newUser.name}`);
      
      // REDIRECT TO MarketPlace PAGE
      console.log('Signup successful! Redirecting to MarketPlace...');
      navigate('/marketplace');
      
    }, 1000);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="login-subtitle">
          {isSignup ? 'Sign up to get started' : 'Please enter your credentials to continue'}
        </p>
        
        {/* User Type Selector */}
        <div className="user-type-selector">
          <button 
            type="button"
            className={`user-type-btn ${userType === 'buyer' ? 'active' : ''}`}
            onClick={() => setUserType('buyer')}
          >
            <i className="fas fa-shopping-cart"></i> Buyer
          </button>
          <button 
            type="button"
            className={`user-type-btn ${userType === 'seller' ? 'active' : ''}`}
            onClick={() => setUserType('seller')}
          >
            <i className="fas fa-store"></i> Seller
          </button>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Show full name field for signup */}
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? "Create a password" : "Enter your password"}
              required
              disabled={isLoading}
              minLength={isSignup ? "6" : ""}
            />
            {isSignup && (
              <small className="password-hint">
                Must be at least 6 characters long
              </small>
            )}
          </div>

          {/* Show confirm password field for signup */}
          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> 
                {isSignup ? 'Creating Account...' : 'Signing in...'}
              </>
            ) : (
              <>
                <i className={`fas ${isSignup ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
                {isSignup ? 'Sign Up' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsSignup(!isSignup);
                resetForm();
              }}
              disabled={isLoading}
            >
              {isSignup ? 'Sign In' : 'Sign up here'}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p><a href="#" className="forgot-link">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;