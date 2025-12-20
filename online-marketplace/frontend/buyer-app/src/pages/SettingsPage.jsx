// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/common/Modal";
import "./SettingsPage.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
    memberSince: "January 2024"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [activeModal, setActiveModal] = useState(null);

  // Modal States
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [emailPrefs, setEmailPrefs] = useState({
    promotions: true,
    orders: true,
    security: true
  });
  const [sitePrefs, setSitePrefs] = useState({
    language: "English",
    country: "Egypt (EG)",
    currency: "EGP - Egyptian Pound"
  });

  // Delivery City State
  const [deliveryCity, setDeliveryCity] = useState("Cairo");
  const [isSavingCity, setIsSavingCity] = useState(false);

  // Egyptian Cities List
  const egyptianCities = [
    "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said",
    "Suez", "Luxor", "Al Mahallah Al Kubra", "Mansoura", "Tanta",
    "Asyut", "Ismailia", "Faiyum", "Zagazig", "Aswan", "Damietta",
    "Damanhur", "El Minya", "Beni Suef", "Qena", "Sohag", "Hurghada",
    "6th of October City", "New Cairo", "Maadi", "Nasr City", "Heliopolis",
    "Madinaty", "El Shorouk", "El Obour", "10th of Ramadan City"
  ];

  // API Base URL
  const BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email) {
      setUser({
        name: storedUser.name || "User",
        email: storedUser.email,
        memberSince: "January 2024" // Mock date
      });
      setFormData({ name: storedUser.name || "", email: storedUser.email });
      // Load city from stored user or default to Cairo
      setDeliveryCity(storedUser.city || "Cairo");
    }

    // Load other prefs
    const savedEmailPrefs = JSON.parse(localStorage.getItem('emailPrefs'));
    if (savedEmailPrefs) setEmailPrefs(savedEmailPrefs);

    const savedSitePrefs = JSON.parse(localStorage.getItem('sitePrefs'));
    if (savedSitePrefs) setSitePrefs(savedSitePrefs);

  }, []);

  const handleEditClick = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...storedUser, name: formData.name, email: formData.email };

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and Email cannot be empty.");
      return;
    }

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser({ ...user, name: formData.name, email: formData.email });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- Modal Handlers ---

  const handleSavePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert("Please fill in all fields.");
      return;
    }

    // Verify current password
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const currentStoredPassword = userPasswords[storedUser.email] || storedUser.password;

    if (currentStoredPassword && currentStoredPassword !== passwordData.current) {
      alert("Current password is incorrect.");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match.");
      return;
    }
    if (passwordData.new.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Save new password to separate storage (persists after logout)
    userPasswords[storedUser.email] = passwordData.new;
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords));

    // Also update current user object
    const updatedUser = { ...storedUser, password: passwordData.new };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    alert("Password updated successfully!");
    setActiveModal(null);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleSaveEmailPrefs = () => {
    localStorage.setItem('emailPrefs', JSON.stringify(emailPrefs));
    alert("Email preferences saved.");
    setActiveModal(null);
  };

  const handleSaveSitePrefs = () => {
    localStorage.setItem('sitePrefs', JSON.stringify(sitePrefs));
    alert("Preferences updated.");
    setActiveModal(null);
  };

  // Save city to backend and localStorage
  const handleSaveCity = async (newCity) => {
    setIsSavingCity(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${BASE_URL}/api/auth/update/buyer`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ city: newCity })
        });
        if (!response.ok) {
          console.error('Failed to save city to backend');
        }
      }
      // Always save to localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.city = newCity;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setDeliveryCity(newCity);
    } catch (error) {
      console.error('Error saving city:', error);
    } finally {
      setIsSavingCity(false);
    }
  };

  // --- Render Modals ---

  const renderPasswordModal = () => (
    <div className="modal-form">
      <label>Current Password</label>
      <input
        type="password"
        className="settings-input"
        value={passwordData.current}
        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
      />
      <label>New Password</label>
      <input
        type="password"
        className="settings-input"
        value={passwordData.new}
        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
      />
      <label>Confirm New Password</label>
      <input
        type="password"
        className="settings-input"
        value={passwordData.confirm}
        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
      />
    </div>
  );

  const renderEmailPrefsModal = () => (
    <div className="modal-form">
      <p>Select the emails you would like to receive:</p>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={emailPrefs.promotions}
            onChange={(e) => setEmailPrefs({ ...emailPrefs, promotions: e.target.checked })}
          />
          Marketing & Promotions
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={emailPrefs.orders}
            onChange={(e) => setEmailPrefs({ ...emailPrefs, orders: e.target.checked })}
          />
          Order Updates
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={emailPrefs.security}
            onChange={(e) => setEmailPrefs({ ...emailPrefs, security: e.target.checked })}
          />
          Security Alerts
        </label>
      </div>
    </div>
  );

  const renderSitePrefsModal = () => (
    <div className="modal-form">
      <label>Language</label>
      <select
        className="settings-input"
        value={sitePrefs.language}
        onChange={(e) => setSitePrefs({ ...sitePrefs, language: e.target.value })}
      >
        <option>English</option>
        <option>Arabic</option>
        <option>French</option>
      </select>

      <label>Country/Region</label>
      <select
        className="settings-input"
        value={sitePrefs.country}
        onChange={(e) => setSitePrefs({ ...sitePrefs, country: e.target.value })}
      >
        <option>Egypt (EG)</option>
        <option>United States (US)</option>
        <option>United Kingdom (UK)</option>
      </select>

      <label>Currency</label>
      <select
        className="settings-input"
        value={sitePrefs.currency}
        onChange={(e) => setSitePrefs({ ...sitePrefs, currency: e.target.value })}
      >
        <option>EGP - Egyptian Pound</option>
        <option>USD - U.S. Dollar</option>
        <option>EUR - Euro</option>
      </select>
    </div>
  );

  const getModalContent = () => {
    switch (activeModal) {
      case 'password':
        return {
          title: "Change Password",
          content: renderPasswordModal(),
          actions: (
            <>
              <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="amazon-btn amazon-btn-primary" onClick={handleSavePassword}>Save Changes</button>
            </>
          )
        };
      case 'email':
        return {
          title: "Email Preferences",
          content: renderEmailPrefsModal(),
          actions: (
            <>
              <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="amazon-btn amazon-btn-primary" onClick={handleSaveEmailPrefs}>Save Settings</button>
            </>
          )
        };
      case 'preferences':
        return {
          title: "Website Preferences",
          content: renderSitePrefsModal(),
          actions: (
            <>
              <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="amazon-btn amazon-btn-primary" onClick={handleSaveSitePrefs}>Update Preferences</button>
            </>
          )
        };
      default: return null;
    }
  };

  const modalData = getModalContent();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Help & Settings</h1>

        <div className="settings-card">
          <div className="settings-header">
            <div>
              <h2>Your Account</h2>
              <p className="settings-subtitle">Manage your account settings</p>
            </div>
            {!isEditing && (
              <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
            )}
          </div>

          <div className="settings-content">
            <div className="settings-section">
              <h3>Account Information</h3>

              {isEditing ? (
                <div className="edit-form">
                  <div className="settings-item">
                    <span className="settings-label">Name:</span>
                    <input
                      className="settings-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="settings-item">
                    <span className="settings-label">Email:</span>
                    <input
                      className="settings-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="action-buttons">
                    <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                    <button className="save-btn" onClick={handleSaveClick}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="settings-item">
                    <span className="settings-label">Name:</span>
                    <span className="settings-value">{user.name}</span>
                  </div>
                  <div className="settings-item">
                    <span className="settings-label">Email:</span>
                    <span className="settings-value">{user.email}</span>
                  </div>
                  <div className="settings-item">
                    <span className="settings-label">Member Since:</span>
                    <span className="settings-value">{user.memberSince}</span>
                  </div>
                </>
              )}
            </div>

            <div className="settings-section">
              <h3>Delivery Location</h3>
              <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <span className="settings-label">
                  <span className="settings-icon">📍</span>
                  Your City
                </span>
                <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>
                  Products will be filtered to show only items that can be delivered to your city.
                </p>
                <select
                  className="settings-input"
                  value={deliveryCity}
                  onChange={(e) => handleSaveCity(e.target.value)}
                  disabled={isSavingCity}
                  style={{ width: '100%', maxWidth: '300px', padding: '10px', fontSize: '14px' }}
                >
                  {egyptianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {isSavingCity && <span style={{ fontSize: '12px', color: '#007185' }}>Saving...</span>}
              </div>
            </div>

            <div className="settings-section">
              <h3>Preferences</h3>

              <div className="settings-item">
                <span className="settings-label">
                  <span className="settings-icon">🌐</span>
                  Language
                </span>
                <span className="settings-value">{sitePrefs.language}</span>
              </div>
              <div className="settings-item">
                <span className="settings-label">
                  <span className="settings-icon">🇪🇬</span>
                  Country/Region
                </span>
                <span className="settings-value">{sitePrefs.country}</span>
              </div>
              <div className="settings-item">
                <span className="settings-label">
                  <span className="settings-icon">💳</span>
                  Currency
                </span>
                <span className="settings-value">{sitePrefs.currency}</span>
              </div>
            </div>

            <div className="settings-section">
              <h3>Help & Support</h3>
              <Link to="/help" className="settings-link">
                <span className="settings-icon">❓</span>
                Help Center
              </Link>
              <Link to="/contact" className="settings-link">
                <span className="settings-icon">📞</span>
                Contact Us
              </Link>
              <Link to="/faq" className="settings-link">
                <span className="settings-icon">📖</span>
                FAQ
              </Link>
            </div>

            <div className="settings-section">
              <h3>Account Actions</h3>
              <button className="settings-button" onClick={() => setActiveModal('password')}>
                <span className="settings-icon">🔒</span>
                Change Password
              </button>
              <button className="settings-button" onClick={() => setActiveModal('email')}>
                <span className="settings-icon">📧</span>
                Email Preferences
              </button>
              <button className="settings-button danger" onClick={handleSignOut}>
                <span className="settings-icon">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={modalData?.title}
          actions={modalData?.actions}
        >
          {modalData?.content}
        </Modal>
      )}

      {/* Inline styles for modal content specific to Settings */}
      <style>{`
        .modal-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 10px;
        }
        .modal-form label {
            font-weight: 700;
            font-size: 14px;
            color: #0F1111;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-size: 14px;
        }
        .edit-link-btn {
            background: none;
            border: none;
            color: #007185;
            cursor: pointer;
            font-size: 14px;
        }
        .edit-link-btn:hover {
            color: #c7511f;
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
