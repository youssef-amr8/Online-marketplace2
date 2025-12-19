import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sellerService from "../services/sellerService";
import "./Settings.css";

function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form states
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        storeName: "",
        storeDescription: "",
        address: "",
        city: "",
        serviceCities: "", // String for input, converted to array on save
        baseDeliveryFee: 50,
    });

    const [notifications, setNotifications] = useState({
        emailOrders: true,
        emailReviews: true,
        emailPromo: false,
        pushOrders: true,
        pushMessages: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user") || "{}");
                if (!userData.isAuthenticated || userData.type !== "seller") {
                    navigate("/login");
                    return;
                }

                setUser(userData);

                // Fetch real profile from backend
                try {
                    const response = await sellerService.getProfile();
                    if (response.success) {
                        const backendProfile = response.data;
                        const p = backendProfile.sellerProfile || {};

                        setProfile({
                            name: backendProfile.name || "",
                            email: backendProfile.email || "",
                            phone: "", // Not in schema yet
                            storeName: p.storeName || "",
                            storeDescription: p.storeDescription || "",
                            address: "", // Not in schema
                            city: p.city || "",
                            serviceCities: (p.serviceCities || []).join(", "),
                            baseDeliveryFee: p.baseDeliveryFee || 50
                        });

                        // Sync notification preferences if they were backend-backed too (skipping for now)
                    }
                } catch (err) {
                    console.error("Failed to fetch profile settings", err);
                    setMessage({ type: "error", text: "Failed to load settings from server" });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Prepare data for backend
            const updateData = {
                name: profile.name,
                storeName: profile.storeName,
                storeDescription: profile.storeDescription,
                city: profile.city,
                // Convert string back to array
                serviceCities: profile.serviceCities.split(",").map(s => s.trim()).filter(Boolean),
                baseDeliveryFee: Number(profile.baseDeliveryFee)
            };

            await sellerService.updateProfile(updateData);

            // Update localStorage user name if changed
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            userData.name = profile.name;
            localStorage.setItem("user", JSON.stringify(userData));

            setMessage({ type: "success", text: "Settings saved successfully!" });
            alert("Success: Settings saved to database!"); // Explicit feedback
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || "Unknown error";
            setMessage({ type: "error", text: `Failed to save: ${errMsg}` });
            alert(`Error: Failed to save. ${errMsg}`); // Explicit feedback
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading Settings...</p>
            </div>
        );
    }

    const tabs = [
        { id: "profile", label: "Profile", icon: "fa-user" },
        { id: "store", label: "Store Info", icon: "fa-store" },
        { id: "notifications", label: "Notifications", icon: "fa-bell" },
        { id: "security", label: "Security", icon: "fa-shield-alt" },
    ];

    return (
        <div className="seller-app">
            <Sidebar />
            <div className="settings-content">
                {/* Header */}
                <div className="settings-header">
                    <div className="header-content">
                        <h1 className="settings-title">
                            <i className="fas fa-cog"></i> Settings
                        </h1>
                        <p className="settings-subtitle">Manage your account and preferences</p>
                    </div>
                </div>

                <div className="settings-container">
                    {/* Tabs */}
                    <div className="settings-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <i className={`fas ${tab.icon}`}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                            {message.text}
                        </div>
                    )}

                    {/* Content */}
                    <div className="settings-panel">
                        {activeTab === "profile" && (
                            <div className="panel-content">
                                <h2 className="panel-title">Profile Information</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your phone"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profile.address}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                </div>
                                <div className="avatar-section">
                                    <div className="avatar">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div className="avatar-info">
                                        <h3>Profile Photo</h3>
                                        <p>Upload a new profile photo</p>
                                        <button className="upload-btn">
                                            <i className="fas fa-upload"></i> Upload Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "store" && (
                            <div className="panel-content">
                                <h2 className="panel-title">Store Information</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Store Name</label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={profile.storeName}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your store name"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Store Description</label>
                                        <textarea
                                            name="storeDescription"
                                            value={profile.storeDescription}
                                            onChange={handleProfileChange}
                                            placeholder="Describe your store..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Store City (Base Location)</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleProfileChange}
                                            placeholder="e.g. Cairo"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Base Delivery Fee (EGP)</label>
                                        <input
                                            type="number"
                                            name="baseDeliveryFee"
                                            value={profile.baseDeliveryFee}
                                            onChange={handleProfileChange}
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Serviceable Cities (Comma separated)</label>
                                        <input
                                            type="text"
                                            name="serviceCities"
                                            value={profile.serviceCities}
                                            onChange={handleProfileChange}
                                            placeholder="e.g. Cairo, Giza, Alexandria"
                                        />
                                        <small className="form-help">Enter the cities where you can deliver orders.</small>
                                    </div>
                                </div>
                                <div className="store-stats">
                                    <div className="stat-item">
                                        <i className="fas fa-star"></i>
                                        <div>
                                            <h4>4.8 Rating</h4>
                                            <p>Based on 234 reviews</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <i className="fas fa-box"></i>
                                        <div>
                                            <h4>47 Products</h4>
                                            <p>Currently listed</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <i className="fas fa-users"></i>
                                        <div>
                                            <h4>1.2K Followers</h4>
                                            <p>Store followers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="panel-content">
                                <h2 className="panel-title">Notification Preferences</h2>
                                <div className="notification-group">
                                    <h3><i className="fas fa-envelope"></i> Email Notifications</h3>
                                    <div className="toggle-list">
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Order Updates</h4>
                                                <p>Receive emails for new orders</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailOrders}
                                                    onChange={() => handleNotificationChange("emailOrders")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Review Notifications</h4>
                                                <p>Get notified when you receive reviews</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailReviews}
                                                    onChange={() => handleNotificationChange("emailReviews")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Promotional Emails</h4>
                                                <p>Receive tips and promotional content</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailPromo}
                                                    onChange={() => handleNotificationChange("emailPromo")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="notification-group">
                                    <h3><i className="fas fa-mobile-alt"></i> Push Notifications</h3>
                                    <div className="toggle-list">
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Order Alerts</h4>
                                                <p>Push notifications for orders</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.pushOrders}
                                                    onChange={() => handleNotificationChange("pushOrders")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Messages</h4>
                                                <p>Get notified for new messages</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.pushMessages}
                                                    onChange={() => handleNotificationChange("pushMessages")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="panel-content">
                                <h2 className="panel-title">Security Settings</h2>
                                <div className="security-section">
                                    <div className="security-item">
                                        <div className="security-icon">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                        <div className="security-info">
                                            <h4>Change Password</h4>
                                            <p>Update your password regularly for security</p>
                                        </div>
                                        <button className="action-link">Change</button>
                                    </div>
                                    <div className="security-item">
                                        <div className="security-icon">
                                            <i className="fas fa-shield-alt"></i>
                                        </div>
                                        <div className="security-info">
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Add an extra layer of security</p>
                                        </div>
                                        <button className="action-link enable">Enable</button>
                                    </div>
                                    <div className="security-item">
                                        <div className="security-icon">
                                            <i className="fas fa-history"></i>
                                        </div>
                                        <div className="security-info">
                                            <h4>Login History</h4>
                                            <p>View recent login activity</p>
                                        </div>
                                        <button className="action-link">View</button>
                                    </div>
                                </div>
                                <div className="danger-zone">
                                    <h3><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                                    <p>Permanently delete your account and all data</p>
                                    <button className="danger-btn">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="settings-actions">
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
        </div>
    );
}

export default Settings;
