import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import "./Settings.css";
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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
        storeDescription: ""
    });

    // Service Area state
    const [storeLocation, setStoreLocation] = useState(null); // { lat, lng }
    const [serviceArea, setServiceArea] = useState({
        address: "",
        serviceableCities: [],
        maxDeliveryRange: 0,
        baseDeliveryFee: 0,
        pricePerKm: 0
    });
    const [newCity, setNewCity] = useState("");

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
                storeDescription: userData.storeDescription || ""
            });

            // Load service area data if exists
            if (userData.location && userData.location.coordinates) {
                const [lng, lat] = userData.location.coordinates;
                setStoreLocation({ lat, lng });
            }
            if (userData.deliverySettings) {
                setServiceArea({
                    address: userData.location?.address || "",
                    serviceableCities: userData.deliverySettings.serviceableCities || [],
                    maxDeliveryRange: userData.deliverySettings.maxDeliveryRange || 0,
                    baseDeliveryFee: userData.deliverySettings.baseDeliveryFee || 0,
                    pricePerKm: userData.deliverySettings.pricePerKm || 0
                });
            }
        } else {
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleServiceAreaChange = (e) => {
        const { name, value } = e.target;
        setServiceArea((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCity = () => {
        if (newCity.trim() && !serviceArea.serviceableCities.includes(newCity.trim())) {
            setServiceArea(prev => ({
                ...prev,
                serviceableCities: [...prev.serviceableCities, newCity.trim()]
            }));
            setNewCity("");
        }
    };

    const handleRemoveCity = (cityToRemove) => {
        setServiceArea(prev => ({
            ...prev,
            serviceableCities: prev.serviceableCities.filter(city => city !== cityToRemove)
        }));
    };






    // Base URL for API calls
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('seller_token'); // Get token

        try {
            // Prepare location and delivery settings
            const location = storeLocation ? {
                type: 'Point',
                coordinates: [storeLocation.lng, storeLocation.lat],
                address: serviceArea.address
            } : undefined;

            const deliverySettings = {
                serviceableCities: serviceArea.serviceableCities,
                maxDeliveryRange: Number(serviceArea.maxDeliveryRange) || 0,
                baseDeliveryFee: Number(serviceArea.baseDeliveryFee) || 0,
                pricePerKm: Number(serviceArea.pricePerKm) || 0
            };

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
                    storeDescription: profile.storeDescription,
                    location,
                    deliverySettings
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Update localStorage with new data including service area
            const updatedUser = {
                ...user,
                ...profile,
                location,
                deliverySettings
            };
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

                    {/* Service Area & Delivery Section */}
                    <div className="settings-section">
                        <h2 className="section-title">
                            <i className="fas fa-map-marked-alt"></i> Service Area & Delivery
                        </h2>

                        {/* Store Location Map */}
                        <div className="form-group full-width">
                            <label>Store Location</label>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                                Click on the map to set your store's location
                            </p>
                            <div style={{ height: '300px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <MapContainer
                                    center={storeLocation || [30.0444, 31.2357]}
                                    zoom={11}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>
                            {storeLocation && (
                                <div style={{ fontSize: '0.9rem', color: '#28a745', marginTop: '5px' }}>
                                    <i className="fas fa-check-circle"></i> Location set: {storeLocation.lat.toFixed(4)}, {storeLocation.lng.toFixed(4)}
                                </div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="form-group full-width">
                            <label>Store Address</label>
                            <input
                                type="text"
                                name="address"
                                value={serviceArea.address}
                                onChange={handleServiceAreaChange}
                                placeholder="Enter your store address"
                            />
                        </div>

                        {/* Serviceable Cities */}
                        <div className="form-group full-width">
                            <label>Serviceable Cities</label>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                                Add cities where you can deliver products
                            </p>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCity())}
                                    placeholder="Enter city name"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCity}
                                    className="settings-btn"
                                    style={{ padding: '10px 20px' }}
                                >
                                    <i className="fas fa-plus"></i> Add
                                </button>
                            </div>
                            <div className="city-tags">
                                {serviceArea.serviceableCities.map((city, index) => (
                                    <span key={index} className="city-tag">
                                        {city}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCity(city)}
                                            className="remove-city-btn"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {serviceArea.serviceableCities.length === 0 && (
                                <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>
                                    No cities added yet
                                </p>
                            )}
                        </div>

                        {/* Delivery Range and Pricing */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Max Delivery Range (km)</label>
                                <input
                                    type="number"
                                    name="maxDeliveryRange"
                                    value={serviceArea.maxDeliveryRange}
                                    onChange={handleServiceAreaChange}
                                    placeholder="e.g., 50"
                                    min="0"
                                />
                                <small>Set to 0 for city-based delivery only</small>
                            </div>
                            <div className="form-group">
                                <label>Base Delivery Fee (EGP)</label>
                                <input
                                    type="number"
                                    name="baseDeliveryFee"
                                    value={serviceArea.baseDeliveryFee}
                                    onChange={handleServiceAreaChange}
                                    placeholder="e.g., 20"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price per Kilometer (EGP)</label>
                                <input
                                    type="number"
                                    name="pricePerKm"
                                    value={serviceArea.pricePerKm}
                                    onChange={handleServiceAreaChange}
                                    placeholder="e.g., 2"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Delivery Fee Preview */}
                        {(serviceArea.baseDeliveryFee > 0 || serviceArea.pricePerKm > 0) && (
                            <div className="delivery-preview">
                                <strong>Delivery Fee Formula:</strong> {serviceArea.baseDeliveryFee} EGP + ({serviceArea.pricePerKm} EGP × distance in km)
                                <br />
                                <small>Example: For 10 km delivery = {serviceArea.baseDeliveryFee} + ({serviceArea.pricePerKm} × 10) = {serviceArea.baseDeliveryFee + (serviceArea.pricePerKm * 10)} EGP</small>
                            </div>
                        )}
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

    // Location Marker Component
    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setStoreLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            },
        });

        return storeLocation ? <Marker position={[storeLocation.lat, storeLocation.lng]} /> : null;
    }
}

export default Settings;
