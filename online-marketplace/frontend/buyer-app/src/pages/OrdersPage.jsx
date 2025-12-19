import React, { useState, useEffect } from 'react';
import './OrdersPage.css';
import OrdersHeader from '../components/orders/OrdersHeader';
import OrdersFilter from '../components/orders/OrdersFilter';
import OrderCard from '../components/orders/OrderCard';
import EmptyOrders from '../components/orders/EmptyOrders';
import orderService from '../services/orderService';

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

      const apiOrders = await orderService.getOrders();
      // Map API orders to component structure
      const mappedOrders = apiOrders.map(order => ({
        id: order._id,
        orderId: order._id, // Use _id as display ID for now
        orderDate: order.createdAt,
        total: order.totalPrice,
        status: order.status.toLowerCase(), // Ensure lowercase for status map
        fullName: order.buyerId?.name || 'Me', // Fallback
        address: '123 Main St', // Placeholder if not in DB
        city: 'Cairo',
        countryName: 'Egypt',
        items: order.items.map(item => ({
          id: item.itemId._id,
          name: item.itemId.title,
          image: item.itemId.images[0] || 'https://via.placeholder.com/100',
          price: item.price,
          quantity: item.quantity
        }))
      }));

      // Filter logic (simplified for real data)
      // Note: Real filter implementation would be more complex with dates
      setOrders(mappedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      if (window.confirm("Confirm that you have received this order?")) {
        await orderService.updateOrderStatus(orderId, 'Delivered');
        fetchOrders(); // Refresh list
        alert("Order confirmed as delivered!");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      alert("Failed to confirm delivery.");
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const filteredOrders = orders.filter(order =>
  (order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase())))
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
              <OrderCard
                key={order.id}
                order={order}
                onConfirmDelivery={() => handleConfirmDelivery(order.id)}
              />
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