import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSellerOrders } from "../services/orderService";
import { getSellerItems } from "../services/itemService";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    newMessages: 0,
    lowStockItems: 0,
  });
  const [pendingActions, setPendingActions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.isAuthenticated && userData.type === 'seller') {
      setUser(userData);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [orders, items] = await Promise.all([
        getSellerOrders(),
        getSellerItems()
      ]);

      // Calculate today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      
      const revenueToday = todayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
      const lowStockItems = items.items?.filter(item => item.stock < 5).length || 0;

      setTodayStats({
        ordersToday: todayOrders.length,
        revenueToday: revenueToday,
        newMessages: 0, // Messages not implemented yet
        lowStockItems: lowStockItems,
      });

      // Set pending actions
      setPendingActions([
        { id: 1, type: "order", title: `${pendingOrdersCount} order${pendingOrdersCount !== 1 ? 's' : ''} awaiting shipment`, icon: "fa-shipping-fast", priority: pendingOrdersCount > 0 ? "high" : "low", link: "/pending-orders" },
        { id: 2, type: "message", title: "0 unread customer messages", icon: "fa-envelope", priority: "low", link: "/messages" },
        { id: 3, type: "stock", title: `${lowStockItems} product${lowStockItems !== 1 ? 's' : ''} low on stock`, icon: "fa-exclamation-triangle", priority: lowStockItems > 0 ? "high" : "low", link: "/your-listings" },
        { id: 4, type: "review", title: "0 new reviews to respond to", icon: "fa-star", priority: "low", link: "/your-listings" },
      ]);

      // Set alerts from recent orders
      const recentDelivered = orders
        .filter(o => o.status === 'Delivered')
        .slice(0, 3)
        .map(order => ({
          id: order._id,
          type: "success",
          message: `Order #${order._id.substring(0, 8)} has been delivered`,
          time: formatTimeAgo(order.updatedAt || order.createdAt)
        }));
      
      const lowStockAlerts = items.items
        ?.filter(item => item.stock < 5)
        .slice(0, 2)
        .map(item => ({
          id: item._id,
          type: "warning",
          message: `${item.title} stock below ${item.stock} units`,
          time: formatTimeAgo(item.updatedAt || item.createdAt)
        })) || [];
      
      setAlerts([...recentDelivered, ...lowStockAlerts].slice(0, 3));

      // Set activity feed from recent orders
      const recentOrders = orders.slice(0, 6).map(order => ({
        id: order._id,
        type: order.status === 'Shipped' ? "shipped" : "order",
        text: order.status === 'Shipped' 
          ? `Order #${order._id.substring(0, 8)} marked as shipped`
          : `New order from ${order.buyerId?.name || 'Customer'}`,
        amount: order.totalPrice,
        time: formatTimeAgo(order.createdAt),
        icon: order.status === 'Shipped' ? "fa-truck" : "fa-shopping-cart"
      }));
      setActivityFeed(recentOrders);

      // Set pending orders
      const pending = orders
        .filter(o => o.status === 'Pending' || o.status === 'Accepted')
        .slice(0, 3)
        .map(order => ({
          id: order._id,
          customer: order.buyerId?.name || 'Customer',
          product: order.items?.[0]?.itemId?.title || 'Product',
          amount: order.totalPrice || 0,
          status: order.status === 'Pending' ? 'Awaiting shipment' : 'Processing'
        }));
      setPendingOrders(pending);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
