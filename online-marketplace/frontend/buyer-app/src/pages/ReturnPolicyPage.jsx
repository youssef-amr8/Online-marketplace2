import React from 'react';
import { Link } from 'react-router-dom';
import './SupportPages.css';

const ReturnPolicyPage = () => {
    return (
        <div className="support-page">
            <h1>Return Policy</h1>
            <div className="support-content">
                <section className="policy-section">
                    <h2>30-Day Return Window</h2>
                    <p>We accept returns within 30 days of delivery for most items. Items must be in their original condition with all tags and packaging intact.</p>
                </section>

                <section className="policy-section">
                    <h2>How to Return an Item</h2>
                    <ol>
                        <li>Go to your <Link to="/orders">Orders page</Link></li>
                        <li>Select the item you want to return</li>
                        <li>Click "Return Item" and follow the instructions</li>
                        <li>Print the prepaid return label</li>
                        <li>Package the item securely and attach the label</li>
                        <li>Drop off at any authorized shipping location</li>
                    </ol>
                </section>

                <section className="policy-section">
                    <h2>Refund Process</h2>
                    <p>Once we receive your return, we'll inspect it and process your refund within 5-7 business days. Refunds will be issued to your original payment method.</p>
                    <ul>
                        <li>Credit/Debit cards: 5-10 business days</li>
                        <li>PayPal: 3-5 business days</li>
                        <li>Store credit: Immediate</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Non-Returnable Items</h2>
                    <p>The following items cannot be returned:</p>
                    <ul>
                        <li>Opened software or digital products</li>
                        <li>Personal care items</li>
                        <li>Perishable goods</li>
                        <li>Custom or personalized items</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Exchanges</h2>
                    <p>We currently don't offer direct exchanges. If you need a different size or color, please return the original item and place a new order.</p>
                </section>

                <section className="policy-section">
                    <h2>Damaged or Defective Items</h2>
                    <p>If you receive a damaged or defective item, please <Link to="/contact">contact us</Link> immediately with photos of the damage. We'll arrange for a replacement or full refund at no cost to you.</p>
                </section>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;
