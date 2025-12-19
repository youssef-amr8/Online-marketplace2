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
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  useEffect(() => {
    // Fetch orders from API
    fetchOrders();
  }, [timeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const apiOrders = await orderService.getOrders();
      // Map API orders to component structure
      const mappedOrders = apiOrders.map(order => {
        // Extract sellerId - handle both populated object and ObjectId string
        let sellerId = null;
        
        // First try: get from order.sellerId (populated or not)
        if (order.sellerId) {
          // If it's a populated object (has _id property)
          if (typeof order.sellerId === 'object') {
            if (order.sellerId._id) {
              sellerId = String(order.sellerId._id);
            } else if (order.sellerId.id) {
              sellerId = String(order.sellerId.id);
            } else {
              // Might be a Mongoose ObjectId object
              sellerId = order.sellerId.toString ? String(order.sellerId) : null;
            }
          } 
          // If it's a string
          else if (typeof order.sellerId === 'string') {
            sellerId = order.sellerId;
          }
          // If it has toString method (Mongoose ObjectId)
          else if (order.sellerId.toString) {
            sellerId = String(order.sellerId);
          }
        }
        
        // Fallback: try to get sellerId from items if not found on order
        if (!sellerId && order.items && order.items.length > 0) {
          // Check if items have sellerId populated
          const firstItem = order.items[0];
          if (firstItem.itemId && firstItem.itemId.sellerId) {
            const itemSellerId = firstItem.itemId.sellerId;
            if (typeof itemSellerId === 'object' && itemSellerId._id) {
              sellerId = String(itemSellerId._id);
            } else if (typeof itemSellerId === 'string') {
              sellerId = itemSellerId;
            } else if (itemSellerId.toString) {
              sellerId = String(itemSellerId);
            }
          }
        }
        
        // Debug logging for troubleshooting
        if (!sellerId) {
          console.warn('⚠️ Could not extract sellerId from order:', {
            orderId: order._id,
            sellerIdRaw: order.sellerId,
            sellerIdType: typeof order.sellerId,
            sellerIdKeys: order.sellerId && typeof order.sellerId === 'object' ? Object.keys(order.sellerId) : null,
            hasItems: !!order.items,
            itemsCount: order.items?.length
          });
        } else {
          console.log('✅ Extracted sellerId:', sellerId, 'from order:', order._id);
        }
        
        return {
          id: order._id,
          orderId: order._id, // Use _id as display ID for now
          orderDate: order.createdAt,
          total: order.totalPrice,
          status: order.status.toLowerCase(), // Ensure lowercase for status map
          fullName: order.buyerId?.name || 'Me', // Fallback
          address: '123 Main St', // Placeholder if not in DB
          city: 'Cairo',
          countryName: 'Egypt',
          sellerId: sellerId, // Include sellerId for flagging
          items: order.items.map(item => ({
            id: item.itemId._id,
            name: item.itemId.title,
            image: item.itemId.images[0] || 'https://via.placeholder.com/100',
            price: item.price,
            quantity: item.quantity
          }))
        };
      });

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
        await fetchOrders(); // Refresh list
        alert("Order confirmed as delivered! It will now appear in History.");
        // If we're on pending tab and no more pending orders, could switch to history
        // But let's keep it simple and just refresh
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

  // Filter orders based on search and tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'pending') {
      // Show orders that are not delivered
      return matchesSearch && order.status !== 'delivered';
    } else {
      // Show only delivered orders
      return matchesSearch && order.status === 'delivered';
    }
  });

  return (
    <div className="orders-container">
      <OrdersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '10px'
      }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'pending' ? '#ff9900' : '#666',
            borderBottom: activeTab === 'pending' ? '2px solid #ff9900' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'pending' ? '600' : '400',
            marginBottom: '-12px'
          }}
        >
          Pending Orders ({orders.filter(o => o.status !== 'delivered').length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'history' ? '#ff9900' : '#666',
            borderBottom: activeTab === 'history' ? '2px solid #ff9900' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'history' ? '600' : '400',
            marginBottom: '-12px'
          }}
        >
          History ({orders.filter(o => o.status === 'delivered').length})
        </button>
      </div>

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