import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Today's quick stats
  const todayStats = {
    ordersToday: 8,
    revenueToday: 456,
    newMessages: 3,
    lowStockItems: 2,
  };

  // Pending actions that need attention
  const pendingActions = [
    { id: 1, type: "order", title: "5 orders awaiting shipment", icon: "fa-shipping-fast", priority: "high", link: "/pending-orders" },
    { id: 2, type: "message", title: "3 unread customer messages", icon: "fa-envelope", priority: "medium", link: "/messages" },
    { id: 3, type: "stock", title: "2 products low on stock", icon: "fa-exclamation-triangle", priority: "high", link: "/your-listings" },
    { id: 4, type: "review", title: "1 new review to respond to", icon: "fa-star", priority: "low", link: "/your-listings" },
  ];

  // Alerts and notifications
  const alerts = [
    { id: 1, type: "success", message: "Order #1234 has been delivered", time: "5 min ago" },
    { id: 2, type: "warning", message: "Smart Watch stock below 5 units", time: "1 hour ago" },
    { id: 3, type: "info", message: "New promotional opportunity available", time: "2 hours ago" },
  ];

  // Live activity feed
  const activityFeed = [
    { id: 1, type: "order", text: "New order from Ahmed M.", amount: 89, time: "Just now", icon: "fa-shopping-cart" },
    { id: 2, type: "payment", text: "Payment received for Order #1230", amount: 156, time: "3 min ago", icon: "fa-credit-card" },
    { id: 3, type: "review", text: "5-star review on Wireless Earbuds", time: "10 min ago", icon: "fa-star" },
    { id: 4, type: "message", text: "Question from Sara about shipping", time: "15 min ago", icon: "fa-comment" },
    { id: 5, type: "order", text: "New order from Omar K.", amount: 45, time: "30 min ago", icon: "fa-shopping-cart" },
    { id: 6, type: "shipped", text: "Order #1228 marked as shipped", time: "1 hour ago", icon: "fa-truck" },
  ];

  // Orders awaiting action
  const pendingOrders = [
    { id: 1231, customer: "Ahmed M.", product: "Wireless Earbuds Pro", amount: 89, status: "Awaiting shipment" },
    { id: 1230, customer: "Sara K.", product: "Smart Watch Series X", amount: 199, status: "Processing" },
    { id: 1229, customer: "Omar A.", product: "Bluetooth Speaker", amount: 65, status: "Awaiting shipment" },
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.isAuthenticated && userData.type === 'seller') {
      setUser(userData);
    }
    // Don't redirect here - ProtectedRoute handles it
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="dashboard-banner">
          <div className="banner-content">
            <h1 className="banner-title">
              {getGreeting()}, <span>{user?.name || 'Seller'}</span>!
            </h1>
            <p className="banner-subtitle">Here's what needs your attention today</p>
          </div>
          <div className="banner-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="dashboard-container">
          {/* Today's Quick Stats */}
          <div className="today-stats">
            <div className="stat-box">
              <div className="stat-icon orders">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">{todayStats.ordersToday}</span>
                <span className="stat-label">Orders Today</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon revenue">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">${todayStats.revenueToday}</span>
                <span className="stat-label">Revenue Today</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon messages">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">{todayStats.newMessages}</span>
                <span className="stat-label">New Messages</span>
              </div>
            </div>
            <div className="stat-box warning">
              <div className="stat-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-number">{todayStats.lowStockItems}</span>
                <span className="stat-label">Low Stock</span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="dashboard-main-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Pending Actions */}
              <section className="action-section">
                <h2 className="section-title">
                  <i className="fas fa-tasks"></i> Pending Actions
                </h2>
                <div className="action-list">
                  {pendingActions.map((action) => (
                    <Link to={action.link} key={action.id} className={`action-item priority-${action.priority}`}>
                      <div className="action-icon">
                        <i className={`fas ${action.icon}`}></i>
                      </div>
                      <span className="action-title">{action.title}</span>
                      <span className={`priority-badge ${action.priority}`}>{action.priority}</span>
                      <i className="fas fa-chevron-right"></i>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Orders Awaiting Action */}
              <section className="orders-section">
                <div className="section-header">
                  <h2 className="section-title">
                    <i className="fas fa-clock"></i> Orders Awaiting Action
                  </h2>
                  <Link to="/pending-orders" className="view-all">View All</Link>
                </div>
                <div className="orders-list">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <span className="order-id">#{order.id}</span>
                        <span className="order-product">{order.product}</span>
                        <span className="order-customer">{order.customer}</span>
                      </div>
                      <div className="order-actions">
                        <span className="order-amount">${order.amount}</span>
                        <button className="ship-btn">
                          <i className="fas fa-truck"></i> Ship Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Alerts */}
              <section className="alerts-section">
                <h2 className="section-title">
                  <i className="fas fa-bell"></i> Alerts
                </h2>
                <div className="alerts-list">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`alert-item ${alert.type}`}>
                      <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' :
                          alert.type === 'warning' ? 'fa-exclamation-triangle' :
                            'fa-info-circle'
                        }`}></i>
                      <div className="alert-content">
                        <p>{alert.message}</p>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activity Feed */}
              <section className="activity-section">
                <h2 className="section-title">
                  <i className="fas fa-stream"></i> Live Activity
                </h2>
                <div className="activity-feed">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="feed-item">
                      <div className={`feed-icon ${item.type}`}>
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <div className="feed-content">
                        <p>{item.text}</p>
                        {item.amount && <span className="feed-amount">+${item.amount}</span>}
                        <span className="feed-time">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <section className="quick-actions-bar">
            <Link to="/add-product" className="quick-action primary">
              <i className="fas fa-plus-circle"></i>
              <span>Add New Product</span>
            </Link>
            <Link to="/messages" className="quick-action">
              <i className="fas fa-reply"></i>
              <span>Reply to Messages</span>
            </Link>
            <Link to="/analytics" className="quick-action">
              <i className="fas fa-chart-line"></i>
              <span>View Analytics</span>
            </Link>
            <Link to="/settings" className="quick-action">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
