import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../common/Modal';

function OrderCard({ order }) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-EG");
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { title: 'Order Pending', description: 'Your order is being processed', step: 1 },
      processing: { title: 'Processing', description: 'Your order is being prepared for shipment', step: 2 },
      shipped: { title: 'Shipped', description: 'Your order has been shipped', step: 3 },
      delivered: { title: 'Delivered', description: 'Your order has been delivered', step: 4 },
    };
    return statusMap[status] || { title: 'Pending', description: 'Your order is being processed', step: 1 };
  };

  const statusDisplay = getStatusDisplay(order.status);

  const [selectedProductForComment, setSelectedProductForComment] = useState(order.items?.[0]?.id || null);

  const handleSubmitComment = () => {
    if (comment.trim() && selectedProductForComment) {
      const existingComments = JSON.parse(localStorage.getItem('product_comments') || '{}');
      const productComments = existingComments[selectedProductForComment] || [];

      const newComment = {
        id: Date.now(),
        text: comment,
        date: new Date().toISOString(),
        author: order.fullName || 'Verified Buyer', // Use order name or fallback
        rating: 5 // Default or link to rating modal
      };

      existingComments[selectedProductForComment] = [newComment, ...productComments];
      localStorage.setItem('product_comments', JSON.stringify(existingComments));

      console.log('Submitted comment for product', selectedProductForComment, ':', comment);
      setComment('');
      setActiveModal(null);
      window.alert('Comment added successfully! It will now appear on the product page.');
    }
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      // Here you would typically send to backend
      console.log('Submitted rating:', rating);
      setRating(0);
      setActiveModal(null);
      window.alert('Thank you for your rating!');
    }
  };

  const renderTrackingModal = () => (
    <div className="tracking-modal">
      <div className="tracking-info">
        <p><strong>Tracking Number:</strong> TRK{order.orderId ? order.orderId.substring(0, 8).toUpperCase() : 'UNKNOWN'}</p>
        <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
      </div>
      <div className="tracking-steps">
        {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
          const isCompleted = index + 1 <= statusDisplay.step;
          const isCurrent = index + 1 === statusDisplay.step;
          return (
            <div key={step} className={`tracking-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="step-icon">{isCompleted ? '✓' : index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDetailsModal = () => (
    <div className="details-modal">
      <div className="details-section">
        <h3>Shipping Information</h3>
        <p><strong>{order.fullName}</strong></p>
        <p>{order.address}</p>
        <p>{order.city}, {order.postalCode}</p>
        <p>{order.countryName}</p>
        <p>Phone: {order.phoneWithCode}</p>
      </div>

      <div className="details-section">
        <h3>Payment Method</h3>
        <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
      </div>

      <div className="details-items">
        <h3>Items</h3>
        {order.items && order.items.map((item, index) => (
          <div key={index} className="detail-item">
            <span>{item.name} x {item.quantity}</span>
            <span>EGP {formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="details-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>EGP {formatPrice(order.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>EGP {formatPrice(order.shipping)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>EGP {formatPrice(order.tax)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>EGP {formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );

  const renderCommentModal = () => (
    <div className="comment-modal">
      <p>Share your experience with this order.</p>

      {order.items && order.items.length > 0 && (
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Product:</label>
          <select
            value={selectedProductForComment || ''}
            onChange={(e) => setSelectedProductForComment(parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {order.items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      )}

      <textarea
        className="comment-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
        rows={5}
        style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
    </div>
  );

  const renderRateModal = () => (
    <div className="rate-modal" style={{ textAlign: 'center', padding: '20px' }}>
      <p>How would you rate your experience?</p>
      <div className="star-rating" style={{ fontSize: '30px', cursor: 'pointer', margin: '15px 0' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            style={{ color: star <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9', marginRight: '5px' }}
          >
            ★
          </span>
        ))}
      </div>
      <p>{rating > 0 ? `You selected ${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}</p>
    </div>
  );

  const getModalContent = () => {
    switch (activeModal) {
      case 'track': return { title: 'Track Package', content: renderTrackingModal(), actions: <button className="amazon-btn amazon-btn-primary" onClick={() => setActiveModal(null)}>Close</button> };
      case 'details': return { title: 'Order Details', content: renderDetailsModal(), actions: <button className="amazon-btn amazon-btn-primary" onClick={() => setActiveModal(null)}>Close</button> };
      case 'comment': return {
        title: 'Write a Product Review',
        content: renderCommentModal(),
        actions: (
          <>
            <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="amazon-btn amazon-btn-primary" onClick={handleSubmitComment} disabled={!comment.trim()}>Submit Review</button>
          </>
        )
      };
      case 'rate': return {
        title: 'Rate Item',
        content: renderRateModal(),
        actions: (
          <>
            <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="amazon-btn amazon-btn-primary" onClick={handleSubmitRating} disabled={rating === 0}>Submit</button>
          </>
        )
      };
      default: return null;
    }
  };

  const modalData = getModalContent();

  return (
    <>
      <div className="order-card">
        <div className="order-header">
          <div className="order-info-group">
            <div className="order-info-item">
              <span className="info-label">ORDER PLACED</span>
              <span className="info-value">{formatDate(order.orderDate)}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">TOTAL</span>
              <span className="info-value">EGP {formatPrice(order.total)}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">SHIP TO</span>
              <span className="info-value">{order.fullName}</span>
            </div>
          </div>
          <div className="order-number">
            <span className="info-label">ORDER # {order.orderId}</span>
          </div>
        </div>

        <div className="order-body">
          <div className="order-status">
            <h3 className="status-title">{statusDisplay.title}</h3>
            <p className="status-description">{statusDisplay.description}</p>
            <p className="delivery-address">
              {order.address}, {order.city}, {order.countryName}
            </p>
          </div>

          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={item.id || index} className="order-item">
                <Link to={`/product/${item.id}`} className="product-link">
                  <img src={item.image} alt={item.name} className="item-image" />
                </Link>
                <div className="item-details">
                  <Link to={`/product/${item.id}`} className="product-link">
                    <h4 className="item-title">{item.name}</h4>
                  </Link>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">EGP {formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-actions">
            <button className="amazon-btn amazon-btn-primary" onClick={() => setActiveModal('track')}>Track Package</button>
            <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal('details')}>View Order Details</button>
            <button className="amazon-btn amazon-btn-secondary" onClick={() => {
              setSelectedProductForComment(order.items?.[0]?.id || null);
              setActiveModal('comment');
            }}>Write Product Review</button>
            <button className="amazon-btn amazon-btn-secondary" onClick={() => setActiveModal('rate')}>Rate Seller</button>
          </div>
        </div>
      </div>

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={modalData?.title}
          actions={modalData?.actions}
        >
          {modalData?.content}
        </Modal>
      )}
    </>
  );
}

export default OrderCard;