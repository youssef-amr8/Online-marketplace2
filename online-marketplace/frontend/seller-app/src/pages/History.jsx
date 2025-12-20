import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders } from "../services/orderService";
import { flagBuyer } from "../services/flagService";
import "./PageStyles.css";

function History() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const [soldOrders, setSoldOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [flagReason, setFlagReason] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const orders = await getSellerOrders(); // uses ./services/orderService which calls /api/orders/seller

      if (!Array.isArray(orders)) {
        console.error("Expected array from getSellerOrders but got:", orders);
        setSoldOrders([]);
        return;
      }

      // Filter for history statuses
      const historyOrders = orders
        .filter(order => order && ['Delivered', 'Refunded', 'Cancelled'].includes(order.status))
        .map(order => {
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
            qty: allItems.reduce((sum, i) => sum + i.quantity, 0),
            buyer: order.buyerId?.name || 'Customer',
            buyerId: order.buyerId?._id || order.buyerId,
            amount: order.totalPrice || 0,
            date: new Date(order.createdAt).toLocaleDateString(),
            status: order.status,
            image: allItems[0]?.image || 'https://via.placeholder.com/100'
          };
        });
      setSoldOrders(historyOrders);
    } catch (error) {
      console.error('Error fetching history:', error);
      setSoldOrders([]);
    } finally {
      setIsLoading(false);
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

  // Stats
  const totalSales = soldOrders.filter(o => o.status === "Delivered").length;
  const totalRevenue = soldOrders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.amount, 0);
  const refundedCount = soldOrders.filter(o => o.status === "Refunded").length;

  const filteredOrders = soldOrders.filter(order => {
    const matchesFilter = filter === "all" ||
      (filter === "delivered" && order.status === "Delivered") ||
      (filter === "refunded" && order.status === "Refunded");
    const matchesSearch = order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <div className="header-content-left">
            <h1 className="page-title">
              <i className="fas fa-history"></i> Sales History
            </h1>
            <p className="page-subtitle">View all your completed orders and transactions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row small">
          <div className="stat-card completed">
            <i className="fas fa-check-circle"></i>
            <div className="stat-data">
              <span className="stat-num">{totalSales}</span>
              <span className="stat-label">Total Sales</span>
            </div>
          </div>
          <div className="stat-card revenue">
            <i className="fas fa-dollar-sign"></i>
            <div className="stat-data">
              <span className="stat-num">${totalRevenue}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
          <div className="stat-card refunded">
            <i className="fas fa-undo"></i>
            <div className="stat-data">
              <span className="stat-num">{refundedCount}</span>
              <span className="stat-label">Refunded</span>
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
                All ({soldOrders.length})
              </button>
              <button
                className={`filter-tab ${filter === "delivered" ? "active" : ""}`}
                onClick={() => setFilter("delivered")}
              >
                <i className="fas fa-check"></i> Delivered ({totalSales})
              </button>
              <button
                className={`filter-tab ${filter === "refunded" ? "active" : ""}`}
                onClick={() => setFilter("refunded")}
              >
                <i className="fas fa-undo"></i> Refunded ({refundedCount})
              </button>
            </div>
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="content-card">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No sales history</h3>
              <p>No orders match your criteria.</p>
            </div>
          ) : (
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id.substring(0, 8)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="product-cell-with-img" style={{ marginBottom: idx < order.items.length - 1 ? '4px' : 0 }}>
                              <img src={item.image} alt={item.title} style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                              <span style={{ fontSize: '12px' }}>{item.title} x{item.quantity}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <span style={{ fontSize: '11px', color: '#666' }}>+{order.items.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td>{order.buyer}</td>
                      <td><span className="date-tag">{order.date}</span></td>
                      <td className="amount">${order.amount}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={`status-badge ${order.status ? order.status.toLowerCase() : ''}`}>
                            {order.status}
                          </span>
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
    </div>
  );
}

export default History;