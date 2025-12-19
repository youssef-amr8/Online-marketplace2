import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders } from "../services/orderService";
import "./PageStyles.css";

function History() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const [soldOrders, setSoldOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        .map(order => ({
          id: order._id || order.id,
          product: order.items?.[0]?.itemId?.title || 'Product',
          qty: order.items?.[0]?.quantity || 1,
          buyer: order.buyerId?.name || 'Customer',
          amount: order.totalPrice || 0,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          image: order.items?.[0]?.itemId?.images?.[0] || 'https://via.placeholder.com/100'
        }));
      setSoldOrders(historyOrders);
    } catch (error) {
      console.error('Error fetching history:', error);
      setSoldOrders([]);
    } finally {
      setIsLoading(false);
    }
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
                      <td className="order-id">#{order.id}</td>
                      <td>
                        <div className="product-cell-with-img">
                          <img src={order.image} alt={order.product} />
                          <span>{order.product}</span>
                        </div>
                      </td>
                      <td>{order.buyer}</td>
                      <td><span className="date-tag">{order.date}</span></td>
                      <td className="amount">${order.amount}</td>
                      <td>
                        <span className={`status-badge ${order.status ? order.status.toLowerCase() : ''}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;