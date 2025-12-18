import React from 'react';
import './SupportPages.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="support-page">
            <h1>Privacy Policy</h1>
            <div className="support-content">
                <p className="policy-intro">Last updated: December 2024</p>

                <section className="policy-section">
                    <h2>Information We Collect</h2>
                    <p>We collect information that you provide directly to us, including:</p>
                    <ul>
                        <li>Name, email address, and contact information</li>
                        <li>Shipping and billing addresses</li>
                        <li>Payment information (processed securely through our payment providers)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with customer service</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Send you promotional emails (with your consent)</li>
                        <li>Improve our products and services</li>
                        <li>Prevent fraud and enhance security</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Information Sharing</h2>
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul>
                        <li>Service providers who help us operate our business (shipping, payment processing)</li>
                        <li>Law enforcement when required by law</li>
                        <li>Business partners with your explicit consent</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Data Security</h2>
                    <p>We implement industry-standard security measures to protect your personal information. This includes:</p>
                    <ul>
                        <li>Encrypted data transmission (SSL/TLS)</li>
                        <li>Secure password storage</li>
                        <li>Regular security audits</li>
                        <li>Limited employee access to personal data</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Export your data</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Cookies and Tracking</h2>
                    <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.</p>
                </section>

                <section className="policy-section">
                    <h2>Children's Privacy</h2>
                    <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children.</p>
                </section>

                <section className="policy-section">
                    <h2>Changes to This Policy</h2>
                    <p>We may update this privacy policy from time to time. We'll notify you of significant changes by email or through a notice on our website.</p>
                </section>

                <section className="policy-section">
                    <h2>Contact Us</h2>
                    <p>If you have questions about this privacy policy or how we handle your data, please contact us at privacy@marketplace.com</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
