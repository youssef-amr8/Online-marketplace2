import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageStyles.css";

function Orders() {
  const navigate = useNavigate();

  // Quick stats
  const stats = {
    totalOrders: 156,
    pending: 12,
    processing: 5,
    completed: 139,
  };

  // Sample pending orders
  const [pendingOrders] = useState([
    { id: 1231, product: "Wireless Earbuds Pro", qty: 2, buyer: "Ahmed M.", amount: 178, date: "Today", status: "Awaiting Shipment" },
    { id: 1230, product: "Smart Watch Series X", qty: 1, buyer: "Sara K.", amount: 199, date: "Today", status: "Processing" },
    { id: 1229, product: "Bluetooth Speaker", qty: 1, buyer: "Omar A.", amount: 65, date: "Yesterday", status: "Awaiting Shipment" },
  ]);

  // Recent completed
  const [recentCompleted] = useState([
    { id: 1228, product: "Laptop Stand Pro", buyer: "Laila A.", amount: 45, date: "Yesterday", status: "Delivered" },
    { id: 1227, product: "USB-C Hub", buyer: "Youssef K.", amount: 35, date: "2 days ago", status: "Delivered" },
    { id: 1226, product: "Gaming Mouse", buyer: "Mona M.", amount: 89, date: "3 days ago", status: "Delivered" },
  ]);

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
                      <button className="action-btn-small ship">
                        <i className="fas fa-truck"></i> Ship
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
