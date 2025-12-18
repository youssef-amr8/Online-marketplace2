import React from 'react';

function OrdersHeader({ searchQuery, setSearchQuery, handleSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="orders-header">
      <div className="breadcrumb">
        <span className="breadcrumb-item">Your Account</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">Your Orders</span>
      </div>

      <div className="header-content">
        <h1 className="orders-title">Your Orders</h1>
        
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search all orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
          <button onClick={handleSearch} className="search-button">
            Search Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdersHeader;