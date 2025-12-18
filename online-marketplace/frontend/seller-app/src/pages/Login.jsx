import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  // Dynamic Base URL: Uses localhost if on localhost, otherwise uses the network IP/hostname
  // For Vite, use import.meta.env
  const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }) // Role not needed for specific endpoint
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) throw new Error(data.message || 'Invalid email or password');

      // Store token if provided
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
      }

      // Store user data
      const userData = data.data?.user || data.user || {};
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        name: userData.name,
        type: userData.role || 'seller',
        isAuthenticated: true
      }));

      setIsLoading(false);
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.message || err.toString() || 'An error occurred';
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('Network') || errorMsg.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 3000.');
      } else {
        setError(errorMsg);
      }
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError('');

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

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register/seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password: password
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) throw new Error(data.message || 'User with this email already exists');

      // Store token if provided
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
      }

      // Store user data
      const userData = data.data?.user || data.user || {};
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        name: userData.name,
        type: userData.role || 'seller',
        isAuthenticated: true
      }));

      alert(`Account created successfully! Welcome ${userData.name || 'Seller'}`);
      setIsLoading(false);
      navigate('/');

    } catch (err) {
      console.error('Signup error:', err);
      const errorMsg = err.message || err.toString() || 'An error occurred';
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('Network') || errorMsg.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 3000.');
      } else {
        setError(errorMsg);
      }
      setIsLoading(false);
    }
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
          {isSignup ? 'Create Account' : 'Welcome Back, seller'}
        </h2>
        <p className="login-subtitle">
          {isSignup
            ? 'Sign up to get started as a seller'
            : 'Please enter your credentials to continue'}
        </p>

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

