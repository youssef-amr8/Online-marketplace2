import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";
import { flagBuyer } from "../services/flagService";
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
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [flagReason, setFlagReason] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShipNow = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Shipped');
      await fetchOrders(); // Refresh to update list
      alert(`Order #${orderId} marked as Shipped!`);
    } catch (error) {
      console.error('Error updating order:', error);
      let msg = 'Failed to update order.';
      if (error.message) {
        msg = error.message;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (typeof error === 'string') {
        msg = error;
      }

      if (msg.includes('Failed to fetch') || msg.includes('Network')) {
        msg = 'Cannot connect to server. Please make sure the backend is running on port 3000.';
      }

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
        shipped: orders.filter(o => o.status === 'Accepted' || o.status === 'Shipped').length,
        completed: orders.filter(o => o.status === 'Delivered').length
      };
      setStats(newStats);

      // Get pending orders (limit 3)
      const pending = orders
        .filter(o => o.status === 'Pending')
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

  const mapOrderToDisplay = (order) => {
    const allItems = order.items?.map(item => ({
      id: item.itemId?._id || item.itemId,
      title: item.itemId?.title || 'Product',
      quantity: item.quantity || 1,
      price: item.price || 0,
      image: item.itemId?.images?.[0] || 'https://via.placeholder.com/100'
    })) || [];

    return {
      id: order._id || order.id,
      items: allItems,
      product: allItems.map(i => i.title).join(', ') || 'Product',
      totalQty: allItems.reduce((sum, i) => sum + i.quantity, 0),
      buyer: order.buyerId?.name || 'Customer',
      buyerId: order.buyerId?._id || order.buyerId,
      amount: order.totalPrice || 0,
      date: new Date(order.createdAt).toLocaleDateString(),
      rawStatus: order.status,
      status: order.status === 'Pending' ? 'Awaiting Shipment' : order.status === 'Accepted' ? 'Shipped' : order.status
    };
  };

  const handleFlagBuyer = async () => {
    if (!flagReason.trim()) {
      alert("Please describe the problem you faced");
      return;
    }

    if (!selectedOrder || !selectedOrder.buyerId) {
      alert("Unable to identify buyer. Please try again later.");
      return;
    }

    setSubmittingFlag(true);
    try {
      await flagBuyer(selectedOrder.buyerId, flagReason, selectedOrder.id);
      alert("Thank you for reporting this issue. We will review it shortly.");
      setShowFlagModal(false);
      setFlagReason("");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error flagging buyer:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to submit flag";
      alert(`Failed to submit flag: ${errorMsg}`);
    } finally {
      setSubmittingFlag(false);
    }
  };

  const openFlagModal = (order) => {
    setSelectedOrder(order);
    setShowFlagModal(true);
  };

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
            <i className="fas fa-truck"></i>
            <div className="stat-data">
              <span className="stat-num">{stats.shipped}</span>
              <span className="stat-label">Shipped</span>
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
                    <td className="order-id">#{order.id.substring(0, 8)}</td>
                    <td className="product-cell">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <span style={{ fontSize: '13px' }}>{item.title} x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <span style={{ fontSize: '12px', color: '#666' }}>+{order.items.length - 3} more items</span>
                        )}
                      </div>
                    </td>
                    <td>{order.buyer}</td>
                    <td><span className="date-tag">{order.date}</span></td>
                    <td className="amount">${order.amount}</td>
                    <td><span className="status-badge pending">{order.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {order.rawStatus === 'Pending' ? (
                          <button className="action-btn-small ship" onClick={() => handleShipNow(order.id)}>
                            <i className="fas fa-shipping-fast"></i> Ship Now
                          </button>
                        ) : (
                          <button className="action-btn-small" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                            <i className="fas fa-truck"></i> {order.rawStatus === 'Shipped' ? 'Shipped' : 'Processing'}
                          </button>
                        )}
                        <button
                          className="action-btn-small"
                          onClick={() => openFlagModal(order)}
                          style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>🚩</span>
                          <span>Flag</span>
                        </button>
                      </div>
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
                    <td className="order-id">#{order.id.substring(0, 8)}</td>
                    <td className="product-cell">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <span style={{ fontSize: '12px' }}>{item.title} x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <span style={{ fontSize: '11px', color: '#666' }}>+{order.items.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td>{order.buyer}</td>
                    <td><span className="date-tag">{order.date}</span></td>
                    <td className="amount">${order.amount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="status-badge completed">{order.status}</span>
                        <button
                          className="action-btn-small"
                          onClick={() => openFlagModal(order)}
                          style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>🚩</span>
                          <span>Flag</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Flag Buyer Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlagReason("");
          setSelectedOrder(null);
        }}
        title="Flag Buyer"
        actions={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                setShowFlagModal(false);
                setFlagReason("");
                setSelectedOrder(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleFlagBuyer}
              disabled={submittingFlag || !flagReason.trim()}
            >
              {submittingFlag ? "Submitting..." : "Submit Flag"}
            </button>
          </>
        }
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '15px', fontSize: '16px' }}>
            <strong>What problem did you face with this buyer?</strong>
          </p>
          {selectedOrder && (
            <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
              Buyer: {selectedOrder.buyer} (Order #{selectedOrder.id})
            </p>
          )}
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Please describe the issue you encountered..."
            rows={6}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Your report will be reviewed by our team. We take all reports seriously.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Orders;
