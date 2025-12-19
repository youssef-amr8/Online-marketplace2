import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";
import "./PageStyles.css";

function PendingOrders() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const orders = await getSellerOrders();
      const mappedOrders = orders.map(order => ({
        id: order._id || order.id,
        product: order.items?.[0]?.itemId?.title || 'Product',
        qty: order.items?.[0]?.quantity || 1,
        buyer: order.buyerId?.name || 'Customer',
        email: order.buyerId?.email || '',
        amount: order.totalPrice || 0,
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.status, // Keep original status for logic
        displayStatus: order.status === 'Pending' ? 'Awaiting Shipment' : order.status === 'Accepted' ? 'Shipped' : order.status === 'Shipped' ? 'Shipped' : order.status,
        image: order.items?.[0]?.itemId?.images?.[0] || 'https://via.placeholder.com/100',
        isFromDB: true // Mark as real order from DB
      }));
      setPendingOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Shipped'); // Direct to Shipped
      await fetchOrders();
      alert(`Order #${orderId} is now Shipped!`);
    } catch (error) {
      console.error('Error updating order:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update order status.';
      alert(`Error: ${msg}`);
    }
  };

  const handleShip = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Shipped');
      await fetchOrders();
      alert(`Order #${orderId} marked as shipped!`);
    } catch (error) {
      console.error('Error updating order:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update order status.';
      alert(`Error: ${msg}`);
    }
  };



  const handleCancel = (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
    }
  };

  const filteredOrders = pendingOrders.filter(order => {
    // Only show active orders in this view
    const isActive = ['Pending', 'Accepted', 'Shipped'].includes(order.status);
    if (!isActive) return false;

    const matchesFilter = filter === "all" ||
      (filter === "awaiting" && order.status === "Pending") ||
      (filter === "shipped" && (order.status === "Shipped" || order.status === "Accepted"));
    const matchesSearch = order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const awaitingCount = pendingOrders.filter(o => o.status === "Pending").length;
  // Merged processing count into shipped or removed
  const shippedCount = pendingOrders.filter(o => o.status === "Shipped" || o.status === "Accepted").length;

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <div className="header-content-left">
            <h1 className="page-title">
              <i className="fas fa-clock"></i> Pending Orders
            </h1>
            <p className="page-subtitle">Orders that need your attention</p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="num">{pendingOrders.length}</span>
              <span className="label">Total Pending</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="content-card filter-card">
          <div className="filter-row">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({pendingOrders.length})
              </button>
              <button
                className={`filter-tab ${filter === "awaiting" ? "active" : ""}`}
                onClick={() => setFilter("awaiting")}
              >
                <i className="fas fa-truck"></i> Awaiting Shipment ({awaitingCount})
              </button>
              <button
                className={`filter-tab ${filter === "shipped" ? "active" : ""}`}
                onClick={() => setFilter("shipped")}
              >
                <i className="fas fa-truck-moving"></i> Shipped ({shippedCount})
              </button>
            </div>
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="content-card">
          {isLoading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <h3>Loading orders...</h3>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No pending orders</h3>
              <p>All caught up! No orders match your criteria.</p>
            </div>
          ) : (
            <div className="orders-list-enhanced">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-main">
                    <img src={order.image} alt={order.product} className="order-img" />
                    <div className="order-details">
                      <div className="order-header">
                        <span className="order-id">Order #{order.id}</span>
                        <span className={`status-badge ${order.status === "Accepted" ? "processing" : order.status === "Shipped" ? "shipped" : "pending"}`}>
                          {order.displayStatus || order.status}
                        </span>
                      </div>
                      <h3 className="order-product">{order.product}</h3>
                      <p className="order-qty">Quantity: {order.qty}</p>
                    </div>
                  </div>
                  <div className="order-customer">
                    <h4>Customer</h4>
                    <p className="customer-name"><i className="fas fa-user"></i> {order.buyer}</p>
                    <p className="customer-email"><i className="fas fa-envelope"></i> {order.email}</p>
                  </div>
                  <div className="order-info">
                    <div className="info-item">
                      <span className="info-label">Order Date</span>
                      <span className="info-value">{order.date}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Amount</span>
                      <span className="info-value amount">${order.amount}</span>
                    </div>
                  </div>
                  <div className="order-actions">
                    {order.isFromDB && order.status === 'Pending' && (
                      <button className="btn-ship" onClick={() => handleProcess(order.id)}>
                        <i className="fas fa-shipping-fast"></i> Ship Now
                      </button>
                    )}
                    {order.isFromDB && order.status === 'Accepted' && (
                      <button className="btn-ship" onClick={() => handleShip(order.id)}>
                        <i className="fas fa-truck"></i> Ship Order
                      </button>
                    )}
                    {order.isFromDB && order.status !== 'Shipped' && (
                      <button className="btn-cancel" onClick={() => handleCancel(order.id)}>
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default PendingOrders;
