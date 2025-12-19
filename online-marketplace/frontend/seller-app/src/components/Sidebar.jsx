import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown open/close
  const [openOrders, setOpenOrders] = useState(false);

  // TRUE when user is inside any orders-related page
  const insideOrders =
    location.pathname === "/orders" ||
    location.pathname === "/pending-orders" ||
    location.pathname === "/history";

  // Auto-open dropdown if user navigates inside orders pages
  useEffect(() => {
    if (insideOrders) setOpenOrders(true);
  }, [insideOrders]);

  const handleLogout = () => {
    localStorage.removeItem('seller_user');
    localStorage.removeItem('seller_token');
    navigate('/login');
  };

  // Get user info
  const user = JSON.parse(localStorage.getItem('seller_user') || '{}');

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">
          <i className="fas fa-store"></i> Seller Hub
        </h2>
        {user.name && (
          <div className="sidebar-user">
            <i className="fas fa-user-circle"></i>
            <span>{user.name}</span>
          </div>
        )}
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link
            to="/dashboard"
            className={`sidebar-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/add-product"
            className={`sidebar-link ${location.pathname === "/add-product" ? "active" : ""}`}
          >
            <i className="fas fa-plus-circle"></i> Add Product
          </Link>
        </li>

        <li>
          <Link
            to="/your-listings"
            className={`sidebar-link ${location.pathname === "/your-listings" ? "active" : ""}`}
          >
            <i className="fas fa-box"></i> Your Listings
          </Link>
        </li>

        {/* ORDERS DROPDOWN */}
        <li className="sidebar-dropdown">
          <div
            className={`sidebar-link ${insideOrders ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Link
              to="/orders"
              style={{ color: "inherit", textDecoration: "none", flex: 1, display: "flex", alignItems: "center", gap: "10px" }}
            >
              <i className="fas fa-shopping-cart"></i> Orders
            </Link>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setOpenOrders(!openOrders);
              }}
              className="dropdown-arrow"
            >
              {openOrders ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-right"></i>}
            </span>
          </div>

          {openOrders && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/pending-orders"
                  className={`sidebar-link sub ${location.pathname === "/pending-orders" ? "active" : ""}`}
                >
                  <i className="fas fa-clock"></i> Pending Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`sidebar-link sub ${location.pathname === "/history" ? "active" : ""}`}
                >
                  <i className="fas fa-history"></i> History
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Divider */}
        <li className="sidebar-divider"></li>

        {/* Analytics */}
        <li>
          <Link
            to="/analytics"
            className={`sidebar-link ${location.pathname === "/analytics" ? "active" : ""}`}
          >
            <i className="fas fa-chart-pie"></i> Analytics
          </Link>
        </li>

        {/* Messages */}
        <li>
          <Link
            to="/messages"
            className={`sidebar-link ${location.pathname === "/messages" ? "active" : ""}`}
          >
            <i className="fas fa-comments"></i> Messages
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link
            to="/settings"
            className={`sidebar-link ${location.pathname === "/settings" ? "active" : ""}`}
          >
            <i className="fas fa-cog"></i> Settings
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
