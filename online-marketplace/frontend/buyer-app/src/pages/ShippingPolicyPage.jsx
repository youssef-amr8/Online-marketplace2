import React from 'react';
import './SupportPages.css';

const ShippingPolicyPage = () => {
    return (
        <div className="support-page">
            <h1>Shipping Policy</h1>
            <div className="support-content">
                <section className="policy-section">
                    <h2>Delivery Options</h2>
                    <p>We offer multiple shipping options to meet your needs:</p>
                    <ul>
                        <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                        <li><strong>Express Shipping:</strong> 2-3 business days</li>
                        <li><strong>Next Day Delivery:</strong> Order by 2 PM for next day delivery</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Shipping Costs</h2>
                    <p>Shipping costs are calculated based on your location and the size/weight of your order.</p>
                    <ul>
                        <li>Free standard shipping on orders over $50</li>
                        <li>Flat rate express shipping: $9.99</li>
                        <li>Next day delivery: $19.99</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Order Tracking</h2>
                    <p>Once your order ships, you'll receive a tracking number via email. You can also track your order by visiting the Orders page in your account.</p>
                </section>

                <section className="policy-section">
                    <h2>International Shipping</h2>
                    <p>We currently ship to select international locations. International shipping times and costs vary by destination. Customs fees and import duties are the responsibility of the customer.</p>
                </section>

                <section className="policy-section">
                    <h2>Delivery Issues</h2>
                    <p>If you experience any issues with your delivery, please contact our customer service team immediately. We'll work to resolve the issue as quickly as possible.</p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
