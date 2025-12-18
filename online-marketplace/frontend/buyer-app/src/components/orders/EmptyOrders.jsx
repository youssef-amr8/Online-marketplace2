import React from 'react';

function EmptyOrders({ timeFilter }) {
  return (
    <div className="empty-orders">
      <p className="empty-message">
        It looks like you haven't placed an order in the {timeFilter}.{' '}
        <a href="#" className="view-all-link">View orders in 2025</a>
      </p>
    </div>
  );
}

export default EmptyOrders;