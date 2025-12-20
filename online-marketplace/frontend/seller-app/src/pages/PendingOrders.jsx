import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";
import { flagBuyer } from "../services/flagService";
import "./PageStyles.css";

function PendingOrders() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [flagReason, setFlagReason] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const orders = await getSellerOrders();
      const mappedOrders = orders.map(order => {
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
          product: allItems[0]?.title || 'Product',
          qty: allItems.reduce((sum, i) => sum + i.quantity, 0),
          buyer: order.buyerId?.name || 'Customer',
          buyerId: order.buyerId?._id || order.buyerId,
          email: order.buyerId?.email || '',
          amount: order.totalPrice || 0,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          displayStatus: order.status === 'Pending' ? 'Awaiting Shipment' : order.status === 'Accepted' ? 'Shipped' : order.status === 'Shipped' ? 'Shipped' : order.status,
          image: allItems[0]?.image || 'https://via.placeholder.com/100',
          isFromDB: true
        };
      });
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
      let msg = 'Failed to update order status.';
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

  const handleShip = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Shipped');
      await fetchOrders();
      alert(`Order #${orderId} marked as shipped!`);
    } catch (error) {
      console.error('Error updating order:', error);
      let msg = 'Failed to update order status.';
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



  const handleCancel = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId.substring(0, 8)}? The buyer will be notified and stock will be restored.`)) {
      try {
        await updateOrderStatus(orderId, 'Cancelled');
        alert('Order cancelled successfully. Stock has been restored.');
        // Refresh orders to update the list
        fetchOrders();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert(`Failed to cancel order: ${error.message}`);
      }
    }
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
                  <div className="order-main" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="order-header" style={{ width: '100%', marginBottom: '12px' }}>
                      <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                      <span className={`status-badge ${order.status === "Accepted" ? "processing" : order.status === "Shipped" ? "shipped" : "pending"}`}>
                        {order.displayStatus || order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '8px', minWidth: '200px' }}>
                          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div>
                            <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>{item.title}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Qty: {item.quantity} • ${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="order-qty" style={{ marginTop: '10px' }}>Total Items: {order.qty}</p>
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
                  <div className="order-actions" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    {order.isFromDB && order.status === 'Pending' && (
                      <button className="btn-ship" onClick={() => handleProcess(order.id)}>
                        <i className="fas fa-shipping-fast"></i> Ship Now
                      </button>
                    )}
                    {order.isFromDB && (order.status === 'Accepted' || order.status === 'Shipped') && (
                      <button className="btn-ship" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                        <i className="fas fa-truck"></i> {order.status === 'Shipped' ? 'Shipped' : 'Processing'}
                      </button>
                    )}
                    {order.isFromDB && order.status !== 'Shipped' && order.status !== 'Accepted' && (
                      <button className="btn-cancel" onClick={() => handleCancel(order.id)}>
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    )}
                    <button
                      className="btn-flag"
                      onClick={() => openFlagModal(order)}
                      style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🚩</span>
                      <span>Flag Buyer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </div >
  );
}

export default PendingOrders;
