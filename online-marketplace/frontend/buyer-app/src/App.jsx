// src/App.jsx - Cleaned Version
import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";
import Header from "./components/Header";
import Categories from "./components/Categories";
// import { categories } from "./data/categories";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import SettingsPage from "./pages/SettingsPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login/Login";
import MarketPlace from "./pages/MarketPlace/MarketPlace";
import HelpCenterPage from "./pages/HelpCenterPage";
import ContactUsPage from "./pages/ContactUsPage";
import FAQPage from "./pages/FAQPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import MessagesPage from "./pages/MessagesPage";
import LocationPrompt from "./components/LocationPrompt";
import { useLocation as useLocationContext } from "./context/LocationContext";
import "./App.css";

// Create context for navigation toggle
export const NavigationContext = createContext();

function AppContent() {
  const location = useLocation();
  const { selectedLocation, selectedCity } = useLocationContext();
  const isLoginPage = location.pathname === '/login';
  const isMarketPlacePage = location.pathname === '/marketplace';
  const [showNavigation, setShowNavigation] = React.useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = React.useState(false);

  // Show location prompt on first load if no location is set
  React.useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('location_prompt_seen');
    if (!hasSeenPrompt && !selectedLocation && !selectedCity && !isLoginPage) {
      setShowLocationPrompt(true);
    }
  }, [selectedLocation, selectedCity, isLoginPage]);


  // Hide navigation on login and marketplace pages (unless toggled on)
  const shouldShowNav = !isLoginPage && (!isMarketPlacePage || showNavigation);

  const handleLocationPromptClose = () => {
    setShowLocationPrompt(false);
    localStorage.setItem('location_prompt_seen', 'true');
  };

  return (
    <NavigationContext.Provider value={{ showNavigation, setShowNavigation }}>
      <div className="App">
        {showLocationPrompt && (
          <LocationPrompt
            isOpen={showLocationPrompt}
            onClose={handleLocationPromptClose}
          />
        )}

        {shouldShowNav && <Header />}
        {shouldShowNav && <Categories />}

        <div className="main-content">
          <Routes>
            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* MarketPlace Page */}
            <Route path="/marketplace" element={<MarketPlace />} />

            {/* Root redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Category Routes */}
            <Route
              path="/category/:categorySlug"
              element={<CategoryPage />}
            />
            <Route
              path="/category/:categorySlug/:subcategorySlug"
              element={<CategoryPage />}
            />
            <Route
              path="/category/:categorySlug/:subcategorySlug/:childSlug"
              element={<CategoryPage />}
            />

            {/* Product Detail */}
            <Route
              path="/product/:productId"
              element={<ProductDetailPage />}
            />

            {/* Cart */}
            <Route path="/cart" element={<CartPage />} />

            {/* Checkout */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Support Pages */}
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Policy Pages */}
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* Search Results */}
            <Route path="/search" element={<CategoryPage />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />

            {/* Messages */}
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <LocationProvider>
            <Router>
              <AppContent />
            </Router>
          </LocationProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
