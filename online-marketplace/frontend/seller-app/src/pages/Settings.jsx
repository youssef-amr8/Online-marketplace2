import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Form state
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        storeName: "",
        storeDescription: "",
    });

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("seller_user") || "{}");
        if (userData.isAuthenticated && userData.type === "seller") {
            setUser(userData);
            setProfile({
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                storeName: userData.storeName || "",
                storeDescription: userData.storeDescription || "",
            });
        } else {
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // Base URL for API calls
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('seller_token'); // Get token

        try {
            const response = await fetch(`${BASE_URL}/api/auth/update/seller`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    storeName: profile.storeName,
                    storeDescription: profile.storeDescription
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Update localStorage
            const updatedUser = { ...user, ...profile };
            localStorage.setItem("seller_user", JSON.stringify(updatedUser));

            // Notify Sidebar and others
            window.dispatchEvent(new Event('userUpdated'));

            setMessage({ type: "success", text: "Settings saved successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword) {
            setMessage({ type: "error", text: "Please enter your current password" });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters" });
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        const token = localStorage.getItem('seller_token'); // Get token

        try {
            const response = await fetch(`${BASE_URL}/api/auth/update/seller`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password update failed');
            }

            setMessage({ type: "success", text: "Password updated successfully!" });
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("seller_user");
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="seller-app">
            <Sidebar />
            <div className="settings-content">
                <div className="settings-header">
                    <div className="header-content">
                        <h1 className="settings-title">
                            <i className="fas fa-cog"></i> Settings
                        </h1>
                        <p className="settings-subtitle">Manage your account and store</p>
                    </div>
                </div>

                <div className="settings-container">
                    {/* Message */}
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Section */}
                    <div className="settings-section">
                        <h2 className="section-title">
                            <i className="fas fa-user"></i> Profile Information
                        </h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    className="disabled"
                                />
                                <small>Email cannot be changed</small>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                    placeholder="Your phone number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Store Section */}
                    <div className="settings-section">
                        <h2 className="section-title">
                            <i className="fas fa-store"></i> Store Information
                        </h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Store Name</label>
                                <input
                                    type="text"
                                    name="storeName"
                                    value={profile.storeName}
                                    onChange={handleProfileChange}
                                    placeholder="Your store name"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Store Description</label>
                                <textarea
                                    name="storeDescription"
                                    value={profile.storeDescription}
                                    onChange={handleProfileChange}
                                    placeholder="Describe your store..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="settings-section">
                        <h2 className="section-title">
                            <i className="fas fa-lock"></i> Security
                        </h2>
                        <div className="security-actions">
                            <button className="settings-btn" onClick={() => setShowPasswordModal(true)}>
                                <i className="fas fa-key"></i>
                                <span>Change Password</span>
                            </button>
                            <button className="settings-btn logout" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="settings-actions-bar">
                        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3><i className="fas fa-lock"></i> Change Password</h3>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handlePasswordChange}>Update Password</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
