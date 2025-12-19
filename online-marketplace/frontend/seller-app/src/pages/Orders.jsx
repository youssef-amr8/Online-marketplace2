import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";
import "./PageStyles.css";

function Orders() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    completed: 0
  });

  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentCompleted, setRecentCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShipNow = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Accepted');
      await fetchOrders(); // Refresh to update list
      alert(`Order #${orderId} moved to Processing!`);
    } catch (error) {
      console.error('Error updating order:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update order.';
      alert(`Error: ${msg}`);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const orders = await getSellerOrders();

      // Calculate stats
      const newStats = {
        totalOrders: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        processing: orders.filter(o => o.status === 'Accepted' || o.status === 'Shipped').length,
        completed: orders.filter(o => o.status === 'Delivered').length
      };
      setStats(newStats);

      // Get pending orders (limit 3)
      const pending = orders
        .filter(o => o.status === 'Pending' || o.status === 'Accepted')
        .slice(0, 3)
        .map(mapOrderToDisplay);
      setPendingOrders(pending);

      // Get recent completed (limit 3)
      const completed = orders
        .filter(o => o.status === 'Delivered')
        .slice(0, 3)
        .map(mapOrderToDisplay);
      setRecentCompleted(completed);

    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapOrderToDisplay = (order) => ({
    id: order._id || order.id,
    product: order.items?.[0]?.itemId?.title || 'Product',
    qty: order.items?.[0]?.quantity || 1,
    buyer: order.buyerId?.name || 'Customer',
    amount: order.totalPrice || 0,
    date: new Date(order.createdAt).toLocaleDateString(),
    status: order.status === 'Pending' ? 'Awaiting Shipment' : order.status === 'Accepted' ? 'Processing' : order.status
  });

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <div className="header-content-left">
            <h1 className="page-title">
              <i className="fas fa-shopping-cart"></i> Orders Overview
            </h1>
            <p className="page-subtitle">Manage all your orders in one place</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <i className="fas fa-shopping-bag"></i>
            <div className="stat-data">
              <span className="stat-num">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card pending">
            <i className="fas fa-clock"></i>
            <div className="stat-data">
              <span className="stat-num">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card processing">
            <i className="fas fa-cog"></i>
            <div className="stat-data">
              <span className="stat-num">{stats.processing}</span>
              <span className="stat-label">Processing</span>
            </div>
          </div>
          <div className="stat-card completed">
            <i className="fas fa-check-circle"></i>
            <div className="stat-data">
              <span className="stat-num">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <Link to="/pending-orders" className="quick-link-card">
            <div className="link-icon pending"><i className="fas fa-clock"></i></div>
            <div className="link-info">
              <h3>Pending Orders</h3>
              <p>Orders awaiting shipment</p>
            </div>
            <i className="fas fa-chevron-right"></i>
          </Link>
          <Link to="/history" className="quick-link-card">
            <div className="link-icon history"><i className="fas fa-history"></i></div>
            <div className="link-info">
              <h3>Sales History</h3>
              <p>View completed orders</p>
            </div>
            <i className="fas fa-chevron-right"></i>
          </Link>
        </div>

        {/* Pending Orders Table */}
        <div className="content-card">
          <div className="card-header-row">
            <h2 className="section-title">
              <i className="fas fa-clock"></i> Pending Orders
            </h2>
            <Link to="/pending-orders" className="view-all-link">View All <i className="fas fa-arrow-right"></i></Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td className="product-cell">{order.product}</td>
                    <td>{order.buyer}</td>
                    <td><span className="date-tag">{order.date}</span></td>
                    <td className="amount">${order.amount}</td>
                    <td><span className="status-badge pending">{order.status}</span></td>
                    <td>
                      <button className="action-btn-small ship" onClick={() => handleShipNow(order.id)}>
                        <i className="fas fa-shipping-fast"></i> Ship Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Completed */}
        <div className="content-card">
          <div className="card-header-row">
            <h2 className="section-title">
              <i className="fas fa-check-circle"></i> Recently Completed
            </h2>
            <Link to="/history" className="view-all-link">View All <i className="fas fa-arrow-right"></i></Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCompleted.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td className="product-cell">{order.product}</td>
                    <td>{order.buyer}</td>
                    <td><span className="date-tag">{order.date}</span></td>
                    <td className="amount">${order.amount}</td>
                    <td><span className="status-badge completed">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
