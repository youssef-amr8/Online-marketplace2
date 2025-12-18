import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

function Analytics() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("week");

    // Sample analytics data
    const [analytics] = useState({
        totalSales: 156,
        totalRevenue: 8750,
        averageOrder: 56.09,
        conversionRate: 3.2,
        pageViews: 4523,
        uniqueVisitors: 1892,
    });

    const dailySales = [
        { day: "Mon", sales: 12, revenue: 580 },
        { day: "Tue", sales: 8, revenue: 420 },
        { day: "Wed", sales: 15, revenue: 890 },
        { day: "Thu", sales: 10, revenue: 540 },
        { day: "Fri", sales: 18, revenue: 1050 },
        { day: "Sat", sales: 22, revenue: 1340 },
        { day: "Sun", sales: 14, revenue: 780 },
    ];

    const topCategories = [
        { name: "Electronics", sales: 45, percentage: 35 },
        { name: "Gaming", sales: 32, percentage: 25 },
        { name: "Accessories", sales: 28, percentage: 22 },
        { name: "Home & Garden", sales: 23, percentage: 18 },
    ];

    const recentTransactions = [
        { id: 1, product: "Wireless Earbuds Pro", customer: "Ahmed Hassan", amount: 89, status: "completed", date: "Today" },
        { id: 2, product: "Smart Watch Series X", customer: "Sara Mohamed", amount: 199, status: "completed", date: "Today" },
        { id: 3, product: "Bluetooth Speaker", customer: "Omar Ali", amount: 65, status: "pending", date: "Yesterday" },
        { id: 4, product: "Laptop Stand Pro", customer: "Laila Ahmed", amount: 45, status: "completed", date: "Yesterday" },
        { id: 5, product: "USB-C Hub", customer: "Youssef Khaled", amount: 35, status: "refunded", date: "2 days ago" },
    ];

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.isAuthenticated && userData.type === "seller") {
            setUser(userData);
        } else {
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading Analytics...</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...dailySales.map((d) => d.revenue));

    return (
        <div className="seller-app">
            <Sidebar />
            <div className="analytics-content">
                {/* Header */}
                <div className="analytics-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1 className="analytics-title">
                                <i className="fas fa-chart-pie"></i> Analytics Dashboard
                            </h1>
                            <p className="analytics-subtitle">Track your store performance and sales insights</p>
                        </div>
                        <div className="time-selector">
                            <button
                                className={`time-btn ${timeRange === "day" ? "active" : ""}`}
                                onClick={() => setTimeRange("day")}
                            >
                                Today
                            </button>
                            <button
                                className={`time-btn ${timeRange === "week" ? "active" : ""}`}
                                onClick={() => setTimeRange("week")}
                            >
                                This Week
                            </button>
                            <button
                                className={`time-btn ${timeRange === "month" ? "active" : ""}`}
                                onClick={() => setTimeRange("month")}
                            >
                                This Month
                            </button>
                        </div>
                    </div>
                </div>

                <div className="analytics-container">
                    {/* Key Metrics */}
                    <div className="metrics-row">
                        <div className="metric-card highlight">
                            <div className="metric-icon">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div className="metric-data">
                                <h3>{analytics.totalSales}</h3>
                                <p>Total Sales</p>
                            </div>
                            <div className="metric-trend positive">
                                <i className="fas fa-arrow-up"></i> 12%
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon revenue">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="metric-data">
                                <h3>${analytics.totalRevenue.toLocaleString()}</h3>
                                <p>Total Revenue</p>
                            </div>
                            <div className="metric-trend positive">
                                <i className="fas fa-arrow-up"></i> 18%
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="fas fa-receipt"></i>
                            </div>
                            <div className="metric-data">
                                <h3>${analytics.averageOrder}</h3>
                                <p>Avg. Order Value</p>
                            </div>
                            <div className="metric-trend positive">
                                <i className="fas fa-arrow-up"></i> 5%
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon conversion">
                                <i className="fas fa-percentage"></i>
                            </div>
                            <div className="metric-data">
                                <h3>{analytics.conversionRate}%</h3>
                                <p>Conversion Rate</p>
                            </div>
                            <div className="metric-trend negative">
                                <i className="fas fa-arrow-down"></i> 2%
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="charts-row">
                        {/* Revenue Chart */}
                        <div className="chart-card large">
                            <div className="card-header">
                                <h2><i className="fas fa-chart-area"></i> Revenue Overview</h2>
                                <span className="badge">Last 7 days</span>
                            </div>
                            <div className="revenue-chart">
                                {dailySales.map((day, index) => (
                                    <div key={index} className="chart-column">
                                        <div className="column-bar-container">
                                            <div
                                                className="column-bar"
                                                style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                            >
                                                <span className="bar-tooltip">${day.revenue}</span>
                                            </div>
                                        </div>
                                        <span className="column-label">{day.day}</span>
                                        <span className="column-value">{day.sales} sales</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories Chart */}
                        <div className="chart-card">
                            <div className="card-header">
                                <h2><i className="fas fa-tags"></i> Top Categories</h2>
                            </div>
                            <div className="categories-chart">
                                {topCategories.map((category, index) => (
                                    <div key={index} className="category-item">
                                        <div className="category-header">
                                            <span className="category-name">{category.name}</span>
                                            <span className="category-sales">{category.sales} sales</span>
                                        </div>
                                        <div className="category-bar">
                                            <div
                                                className="category-fill"
                                                style={{ width: `${category.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="category-percentage">{category.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Traffic Stats */}
                    <div className="traffic-row">
                        <div className="traffic-card">
                            <div className="traffic-icon">
                                <i className="fas fa-eye"></i>
                            </div>
                            <div className="traffic-data">
                                <h3>{analytics.pageViews.toLocaleString()}</h3>
                                <p>Page Views</p>
                            </div>
                        </div>
                        <div className="traffic-card">
                            <div className="traffic-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="traffic-data">
                                <h3>{analytics.uniqueVisitors.toLocaleString()}</h3>
                                <p>Unique Visitors</p>
                            </div>
                        </div>
                        <div className="traffic-card">
                            <div className="traffic-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="traffic-data">
                                <h3>4:32</h3>
                                <p>Avg. Session</p>
                            </div>
                        </div>
                        <div className="traffic-card">
                            <div className="traffic-icon">
                                <i className="fas fa-redo"></i>
                            </div>
                            <div className="traffic-data">
                                <h3>42%</h3>
                                <p>Return Rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="transactions-section">
                        <div className="card-header">
                            <h2><i className="fas fa-history"></i> Recent Transactions</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="product-cell">{transaction.product}</td>
                                        <td>{transaction.customer}</td>
                                        <td><span className="date-badge">{transaction.date}</span></td>
                                        <td className="amount-cell">${transaction.amount}</td>
                                        <td>
                                            <span className={`status-badge ${transaction.status}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
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

export default Analytics;
