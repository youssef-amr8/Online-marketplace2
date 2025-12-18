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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email) {
      setUser({
        name: storedUser.name || "User",
        email: storedUser.email,
        memberSince: "January 2024" // Mock date
      });
      setFormData({ name: storedUser.name || "", email: storedUser.email });
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' }}>
                <h3 style={{ border: 'none', margin: 0, padding: 0 }}>Preferences</h3>
                <button className="edit-link-btn" onClick={() => setActiveModal('preferences')}>Edit</button>
              </div>

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
