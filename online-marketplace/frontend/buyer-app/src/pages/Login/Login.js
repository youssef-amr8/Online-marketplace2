import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const { login, register } = useAuth();

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
      const result = await login(email.trim(), password);

      if (result.success) {
        navigate('/marketplace');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
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
      const result = await register({
        name: fullName.trim(),
        email: email.trim(),
        password: password
      });

      if (result.success) {
        navigate('/marketplace');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
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
          {isSignup ? 'Create Account' : 'Welcome Back, Buyer'}
        </h2>
        <p className="login-subtitle">
          {isSignup
            ? 'Sign up to get started as a buyer'
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

