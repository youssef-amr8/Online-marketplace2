import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerOrders } from "../services/orderService";
import "./Analytics.css";

function Analytics() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("week");
    const [analytics, setAnalytics] = useState({
        totalSales: 0,
        totalRevenue: 0,
        averageOrder: 0,
        completedOrders: 0,
        returnRate: 0,
    });
    const [dailySales, setDailySales] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("seller_user") || "{}");
        if (userData.isAuthenticated && userData.type === "seller") {
            setUser(userData);
        } else {
            navigate("/login");
        }
        fetchAnalyticsData();
    }, [navigate, timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            setIsLoading(true);
            const orders = await getSellerOrders();

            // Filter orders based on time range
            const now = new Date();
            let startDate = new Date();
            if (timeRange === "day") {
                startDate.setHours(0, 0, 0, 0);
            } else if (timeRange === "week") {
                startDate.setDate(now.getDate() - 7);
            } else if (timeRange === "month") {
                startDate.setMonth(now.getMonth() - 1);
            }

            const filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startDate;
            });

            // Calculate analytics
            const totalSales = filteredOrders.length;
            const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            const averageOrder = totalSales > 0 ? totalRevenue / totalSales : 0;
            const completedOrders = filteredOrders.filter(o => o.status === 'Delivered').length;
            const conversionRate = totalSales > 0 ? (completedOrders / totalSales) * 100 : 0;

            // Calculate refund/return rate
            // Assuming 'Cancelled' or 'Refunded' status counts as a return
            const returnedOrders = filteredOrders.filter(o => o.status === 'Cancelled' || o.status === 'Refunded').length;
            const returnRate = totalSales > 0 ? (returnedOrders / totalSales) * 100 : 0;

            setAnalytics({
                totalSales,
                totalRevenue,
                averageOrder: averageOrder.toFixed(2),
                completedOrders,
                returnRate: returnRate.toFixed(1),
            });

            // Calculate daily sales for last 7 days
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dailyData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const dayOrders = orders.filter(order => { // Use all orders for daily trend, or filtered? Usually trend is fixed range
                    // Let's stick to the requested time range filtering logic for consistency, 
                    // BUT usually daily charts show a fixed 7-day window irrespective of the "total" filter. 
                    // The code below uses 'filteredOrders' which might be wrong if range is 'day'. 
                    // Actually, listing logic (lines 71-91) used 'filteredOrders' but the loop is for 7 days.
                    // If timeRange is 'day', filteredOrders is only TODAY. So chart only shows today.
                    // If we want the chart to ALWAYS show last 7 days sales trend, we should use 'orders'.
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= date && orderDate < nextDate;
                });

                dailyData.push({
                    day: days[date.getDay()],
                    sales: dayOrders.length,
                    revenue: dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                });
            }
            setDailySales(dailyData);

            // Calculate top categories
            const categoryMap = {};
            filteredOrders.forEach(order => {
                order.items?.forEach(item => {
                    const category = item.itemId?.category || 'Other';
                    if (!categoryMap[category]) {
                        categoryMap[category] = { sales: 0, revenue: 0 };
                    }
                    categoryMap[category].sales += item.quantity;
                    categoryMap[category].revenue += (item.price * item.quantity);
                });
            });

            const categories = Object.entries(categoryMap)
                .map(([name, data]) => ({
                    name,
                    sales: data.sales,
                    revenue: data.revenue
                }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 4);

            const totalCategorySales = categories.reduce((sum, c) => sum + c.sales, 0);
            const categoriesWithPercentage = categories.map(cat => ({
                ...cat,
                percentage: totalCategorySales > 0 ? Math.round((cat.sales / totalCategorySales) * 100) : 0
            }));
            setTopCategories(categoriesWithPercentage);

            // Recent transactions
            const transactions = filteredOrders
                .slice(0, 5)
                .map(order => ({
                    id: order._id,
                    product: order.items?.[0]?.itemId?.title || 'Product',
                    customer: order.buyerId?.name || 'Customer',
                    amount: order.totalPrice || 0,
                    status: order.status === 'Delivered' ? 'completed' : order.status.toLowerCase(),
                    date: formatDate(order.createdAt)
                }));
            setRecentTransactions(transactions);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

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
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="metric-data">
                                <h3>{analytics.completedOrders}</h3>
                                <p>Completed Orders</p>
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon" style={{ backgroundColor: '#FFEBEE', color: '#C7511F' }}>
                                <i className="fas fa-undo"></i>
                            </div>
                            <div className="metric-data">
                                <h3>{analytics.returnRate}%</h3>
                                <p>Return Rate</p>
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
