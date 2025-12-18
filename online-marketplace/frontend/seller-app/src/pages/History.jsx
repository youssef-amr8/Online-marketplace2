import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./PageStyles.css";

function History() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const [soldOrders] = useState([
    { id: 1226, product: "Wireless Earbuds Pro", qty: 2, buyer: "Ahmed M.", amount: 178, date: "2024-01-15", status: "Delivered", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100" },
    { id: 1225, product: "Smart Watch Series X", qty: 1, buyer: "Sara K.", amount: 199, date: "2024-01-14", status: "Delivered", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100" },
    { id: 1224, product: "Bluetooth Speaker", qty: 1, buyer: "Omar A.", amount: 65, date: "2024-01-13", status: "Delivered", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100" },
    { id: 1223, product: "Laptop Stand Pro", qty: 1, buyer: "Laila A.", amount: 45, date: "2024-01-12", status: "Refunded", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100" },
    { id: 1222, product: "USB-C Hub 7-in-1", qty: 2, buyer: "Youssef K.", amount: 70, date: "2024-01-11", status: "Delivered", image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=100" },
    { id: 1221, product: "Gaming Mouse Pro", qty: 1, buyer: "Mona M.", amount: 89, date: "2024-01-10", status: "Delivered", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100" },
  ]);

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
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
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