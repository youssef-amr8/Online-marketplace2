import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../context/LocationContext';
import './LocationPrompt.css';

// Fix Leaflet Default Icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EGYPTIAN_CITIES = [
    "Cairo", "Giza", "Alexandria", "Shubra El Kheima", "Port Said", "Suez",
    "Luxor", "Mansoura", "El-Mahalla El-Kubra", "Tanta", "Asyut", "Ismailia",
    "Fayyum", "Zagazig", "Aswan", "Damietta", "Damanhur", "Minya", "Beni Suef",
    "Qena", "Sohag", "Hurghada", "6th of October", "Shibin El Kom", "Banha",
    "Kafr el-Sheikh", "Arish", "Mallawi", "10th of Ramadan", "Bilbais"
];

const LocationPrompt = ({ onClose, isOpen }) => {
    const { updateLocation } = useLocation();
    const [step, setStep] = useState('choice'); // 'choice', 'gps', 'manual', 'map'
    const [selectedCity, setSelectedCity] = useState('');
    const [mapLocation, setMapLocation] = useState(null);
    const [isLoadingGPS, setIsLoadingGPS] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGPSLocation = () => {
        setStep('gps');
        setIsLoadingGPS(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoadingGPS(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateLocation(location, ''); // City will be determined by reverse geocoding if needed
                setIsLoadingGPS(false);
                onClose();
            },
            (error) => {
                setError('Unable to retrieve your location. Please try manual selection.');
                setIsLoadingGPS(false);
            }
        );
    };

    const handleManualCity = () => {
        if (!selectedCity) {
            setError('Please select a city');
            return;
        }
        // Use a default location for the selected city (you can enhance this with city coordinates)
        updateLocation(null, selectedCity);
        onClose();
    };

    const handleMapLocation = () => {
        if (!mapLocation) {
            setError('Please click on the map to select your location');
            return;
        }
        updateLocation(mapLocation, selectedCity);
        onClose();
    };

    const handleSkip = () => {
        // User can browse all products without location filtering
        onClose();
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setMapLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
                setError('');
            },
        });

        return mapLocation ? <Marker position={[mapLocation.lat, mapLocation.lng]} /> : null;
    }

    return (
        <div className="location-prompt-overlay">
            <div className="location-prompt-modal">
                <div className="location-prompt-header">
                    <h2>
                        <i className="fas fa-map-marker-alt"></i> Set Your Delivery Location
                    </h2>
                    <p>We'll show you products available in your area</p>
                </div>

                <div className="location-prompt-body">
                    {step === 'choice' && (
                        <div className="location-options">
                            <button className="location-option-btn" onClick={handleGPSLocation}>
                                <i className="fas fa-crosshairs"></i>
                                <span>Use My Current Location</span>
                                <small>Detect automatically via GPS</small>
                            </button>

                            <button className="location-option-btn" onClick={() => setStep('manual')}>
                                <i className="fas fa-city"></i>
                                <span>Select City Manually</span>
                                <small>Choose from a list of cities</small>
                            </button>

                            <button className="location-option-btn" onClick={() => setStep('map')}>
                                <i className="fas fa-map"></i>
                                <span>Pick on Map</span>
                                <small>Click on the map to set location</small>
                            </button>

                            <button className="skip-btn" onClick={handleSkip}>
                                Skip for now
                            </button>
                        </div>
                    )}

                    {step === 'gps' && (
                        <div className="gps-loading">
                            {isLoadingGPS ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <p>Detecting your location...</p>
                                </>
                            ) : error ? (
                                <>
                                    <i className="fas fa-exclamation-circle"></i>
                                    <p className="error-text">{error}</p>
                                    <button className="back-btn" onClick={() => setStep('choice')}>
                                        Try Another Method
                                    </button>
                                </>
                            ) : null}
                        </div>
                    )}

                    {step === 'manual' && (
                        <div className="manual-selection">
                            <label htmlFor="city-select">Select Your City:</label>
                            <select
                                id="city-select"
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setError('');
                                }}
                                className="city-dropdown"
                            >
                                <option value="">-- Choose a city --</option>
                                {EGYPTIAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            {error && <p className="error-text">{error}</p>}

                            <div className="manual-actions">
                                <button className="back-btn" onClick={() => setStep('choice')}>
                                    Back
                                </button>
                                <button className="confirm-btn" onClick={handleManualCity}>
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'map' && (
                        <div className="map-selection">
                            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                                Click on the map to set your delivery location
                            </p>

                            <div className="map-container">
                                <MapContainer
                                    center={[30.0444, 31.2357]} // Cairo default
                                    zoom={11}
                                    style={{ height: '350px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>

                            {mapLocation && (
                                <div className="location-confirmation">
                                    <i className="fas fa-check-circle"></i>
                                    Location selected: {mapLocation.lat.toFixed(4)}, {mapLocation.lng.toFixed(4)}
                                </div>
                            )}

                            <div className="city-select-wrapper">
                                <label htmlFor="map-city-select">City (Optional):</label>
                                <select
                                    id="map-city-select"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="city-dropdown"
                                >
                                    <option value="">-- Choose a city --</option>
                                    {EGYPTIAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {error && <p className="error-text">{error}</p>}

                            <div className="map-actions">
                                <button className="back-btn" onClick={() => setStep('choice')}>
                                    Back
                                </button>
                                <button className="confirm-btn" onClick={handleMapLocation}>
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationPrompt;
