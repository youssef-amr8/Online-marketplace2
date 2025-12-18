import React, { useState, useEffect } from 'react';
import './OrdersPage.css';
import OrdersHeader from '../components/orders/OrdersHeader';
import OrdersFilter from '../components/orders/OrdersFilter';
import OrderCard from '../components/orders/OrderCard';
import EmptyOrders from '../components/orders/EmptyOrders';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('past three months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from API
    fetchOrders();
  }, [timeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Load orders from localStorage
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

      // Filter by time if needed
      const now = new Date();
      let filtered = storedOrders;

      if (timeFilter === 'past 30 days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filtered = storedOrders.filter(order => new Date(order.orderDate) >= thirtyDaysAgo);
      } else if (timeFilter === 'past three months') {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        filtered = storedOrders.filter(order => new Date(order.orderDate) >= threeMonthsAgo);
      } else if (timeFilter === 'past year') {
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filtered = storedOrders.filter(order => new Date(order.orderDate) >= oneYearAgo);
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

      setOrders(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const filteredOrders = orders.filter(order =>
    order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="orders-container">
      <OrdersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <OrdersFilter
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        orderCount={filteredOrders.length}
      />

      <div className="orders-content">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrders timeFilter={timeFilter} />
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <div className="browsing-history-note">
        After viewing product detail pages, look here to find an easy way to navigate back to pages you are interested in.
      </div>
    </div>
  );
}

export default Orders;