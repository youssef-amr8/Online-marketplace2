import React from 'react';
import './SupportPages.css';

const FAQPage = () => {
    return (
        <div className="support-page">
            <h1>Frequently Asked Questions</h1>
            <div className="support-content">
                <div className="faq-item">
                    <h3>How do I track my order?</h3>
                    <p>Go to Your Orders and click on the "Track Package" button next to your order.</p>
                </div>
                <div className="faq-item">
                    <h3>Can I cancel my order?</h3>
                    <p>You can cancel orders that haven't entered the shipping process yet. Go to Your Orders to check eligibility.</p>
                </div>
                <div className="faq-item">
                    <h3>What is the return policy?</h3>
                    <p>You can return most items within 30 days of delivery for a full refund.</p>
                </div>
                <div className="faq-item">
                    <h3>How do I change my password?</h3>
                    <p>Go to Settings &gt; Account Actions &gt; Change Password.</p>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
