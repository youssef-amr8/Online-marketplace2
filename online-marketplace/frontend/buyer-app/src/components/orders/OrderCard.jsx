import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../common/Modal';
import commentService from '../../services/commentService';
import flagService from '../../services/flagService';

function OrderCard({ order, onConfirmDelivery, onCancelOrder }) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [submittingFlag, setSubmittingFlag] = useState(false);

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
      pending: { title: 'Order Pending', description: 'Your order is being processed (Awaiting Shipment)', step: 1 },
      accepted: { title: 'Shipped', description: 'Your order has been shipped', step: 2 },
      processing: { title: 'Shipped', description: 'Your order has been shipped', step: 2 },
      shipped: { title: 'Shipped', description: 'Your order has been shipped', step: 2 },
      delivered: { title: 'Delivered', description: 'Your order has been delivered', step: 3 },
      cancelled: { title: 'Order Cancelled', description: 'This order was cancelled. Stock has been returned.', step: 0 },
    };
    return statusMap[status] || { title: 'Pending', description: 'Your order is being processed', step: 1 };
  };

  const statusDisplay = getStatusDisplay(order.status);

  const [selectedProductForComment, setSelectedProductForComment] = useState(order.items?.[0]?.id || null);

  const handleSubmitComment = async () => {
    if (comment.trim() && selectedProductForComment) {
      try {
        await commentService.addComment(selectedProductForComment, comment, rating || 5, order.id);

        console.log('Submitted comment for product', selectedProductForComment, ':', comment);
        setComment('');
        setRating(0);
        setActiveModal(null);
        window.alert('Comment added successfully! It will now appear on the product page.');
      } catch (error) {
        console.error('Error submitting comment:', error);
        window.alert('Failed to submit comment. Please try again.');
      }
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

  const handleFlagSeller = async () => {
    if (!flagReason.trim()) {
      alert("Please describe the problem you faced");
      return;
    }

    // Extract sellerId - handle multiple possible formats
    // The sellerId should already be extracted as a string in OrdersPage.jsx
    // But we'll add extra safety checks here
    let sellerId = order.sellerId;

    // If it's still an object, extract the ID
    if (sellerId && typeof sellerId === 'object') {
      sellerId = sellerId._id || sellerId.id || (sellerId.toString ? String(sellerId) : null);
    }

    // Convert to string if not already
    if (sellerId && typeof sellerId !== 'string') {
      sellerId = String(sellerId);
    }

    console.log('🔍 Flag Seller Debug:', {
      orderId: order.id,
      sellerIdRaw: order.sellerId,
      sellerIdExtracted: sellerId,
      sellerIdType: typeof order.sellerId,
      fullOrder: order
    });

    if (!sellerId || sellerId === 'null' || sellerId === 'undefined') {
      console.error('❌ SellerId not found in order:', {
        orderId: order.id,
        sellerId: order.sellerId,
        orderKeys: Object.keys(order)
      });
      alert("Unable to identify seller. Please try again later. Check console for details.");
      return;
    }

    setSubmittingFlag(true);
    try {
      console.log('🚩 Submitting flag with sellerId:', sellerId);
      await flagService.flagSeller(sellerId, flagReason, order.id);
      alert("Thank you for reporting this issue. We will review it shortly.");
      setShowFlagModal(false);
      setFlagReason("");
    } catch (error) {
      console.error("❌ Error flagging seller:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to submit flag";
      alert(`Failed to submit flag: ${errorMsg}`);
    } finally {
      setSubmittingFlag(false);
    }
  };

  const renderFlagModal = () => (
    <div style={{ padding: '20px' }}>
      <p style={{ marginBottom: '15px', fontSize: '16px' }}>
        <strong>What problem did you face with this seller?</strong>
      </p>
      <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
        Order #{order.orderId ? order.orderId.substring(0, 8) : 'N/A'}
      </p>
      <textarea
        value={flagReason}
        onChange={(e) => setFlagReason(e.target.value)}
        placeholder="Please describe the issue you encountered..."
        rows={6}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      />
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Your report will be reviewed by our team. We take all reports seriously.
      </p>
    </div>
  );

  const renderTrackingModal = () => (
    <div className="tracking-modal">
      <div className="tracking-info">
        <p><strong>Tracking Number:</strong> TRK{order.orderId ? order.orderId.substring(0, 8).toUpperCase() : 'UNKNOWN'}</p>
        <p><strong>Estimated Delivery:</strong> Your order will be shipped in 3-6 business days</p>
      </div>
      <div className="tracking-steps">
        {['Order Placed', 'Shipped', 'Delivered'].map((step, index) => {
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
            <div style={{ margin: '10px 0' }}>
              <span style={{ marginRight: '10px' }}>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9', fontSize: '20px' }}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="amazon-btn amazon-btn-primary" onClick={handleSubmitComment} disabled={!comment.trim() || rating === 0}>Submit Review</button>
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
            {order.status === 'pending' && (
              <button
                className="amazon-btn amazon-btn-secondary"
                onClick={onCancelOrder}
                style={{
                  backgroundColor: '#f1f1f1',
                  color: '#111',
                  border: '1px solid #d5d9d9',
                  boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)'
                }}
              >
                Cancel Order
              </button>
            )}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <button
                className="amazon-btn amazon-btn-secondary"
                onClick={() => setShowFlagModal(true)}
                style={{
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none'
                }}
              >
                🚩 Flag Seller
              </button>
            )}
            {order.status !== 'delivered' && (
              <button
                className={`amazon-btn ${order.status === 'pending' ? 'amazon-btn-disabled' : 'amazon-btn-primary'}`}
                disabled={order.status === 'pending'}
                onClick={onConfirmDelivery}
                style={{ marginLeft: 'auto', backgroundColor: order.status === 'pending' ? '#ccc' : '#ffd814', borderColor: order.status === 'pending' ? '#ccc' : '#FCD200' }}
              >
                Confirm Delivery
              </button>
            )}
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

      {/* Flag Seller Modal */}
      {showFlagModal && (
        <Modal
          isOpen={showFlagModal}
          onClose={() => {
            setShowFlagModal(false);
            setFlagReason("");
          }}
          title="Flag Seller"
          actions={
            <>
              <button
                className="amazon-btn amazon-btn-secondary"
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="amazon-btn amazon-btn-primary"
                onClick={handleFlagSeller}
                disabled={submittingFlag || !flagReason.trim()}
                style={{ backgroundColor: '#ff6b6b' }}
              >
                {submittingFlag ? "Submitting..." : "Submit Flag"}
              </button>
            </>
          }
        >
          {renderFlagModal()}
        </Modal>
      )}
    </>
  );
}

export default OrderCard;