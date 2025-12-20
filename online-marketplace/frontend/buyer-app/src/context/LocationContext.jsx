import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState(() => {
        // Load from localStorage on init
        const saved = localStorage.getItem('buyer_location');
        return saved ? JSON.parse(saved) : null;
    });

    const [selectedCity, setSelectedCity] = useState(() => {
        const saved = localStorage.getItem('buyer_city');
        return saved || '';
    });

    // Persist to localStorage whenever location changes
    useEffect(() => {
        if (selectedLocation) {
            localStorage.setItem('buyer_location', JSON.stringify(selectedLocation));
        } else {
            localStorage.removeItem('buyer_location');
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('buyer_city', selectedCity);
        } else {
            localStorage.removeItem('buyer_city');
        }
    }, [selectedCity]);

    const updateLocation = (location, city) => {
        setSelectedLocation(location);
        if (city) setSelectedCity(city);
    };

    const clearLocation = () => {
        setSelectedLocation(null);
        setSelectedCity('');
    };

    return (
        <LocationContext.Provider
            value={{
                selectedLocation,
                selectedCity,
                updateLocation,
                clearLocation,
                setSelectedCity
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};
