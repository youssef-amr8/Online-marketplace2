import React from 'react';

function OrdersFilter({ timeFilter, setTimeFilter, orderCount }) {
  const timeOptions = [
    'past three months',
    'past six months',
    'this year',
    'last year',
    'all orders'
  ];

  return (
    <div className="orders-filter">
      <div className="filter-tabs">
        <button className="filter-tab active">Orders</button>
      </div>

      <div className="filter-dropdown-section">
        <span className="order-count">
          <strong>{orderCount} orders</strong> placed in
        </span>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="time-filter-dropdown"
        >
          {timeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default OrdersFilter;