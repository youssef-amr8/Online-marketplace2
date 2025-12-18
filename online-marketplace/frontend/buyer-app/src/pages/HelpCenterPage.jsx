import React from 'react';
import { Link } from 'react-router-dom';
import './SupportPages.css';

const HelpCenterPage = () => {
    return (
        <div className="support-page">
            <div className="help-header">
                <h1>Help Center</h1>
                <p className="help-subtitle">Browse help topics or search for answers</p>
            </div>

            <div className="support-content">
                {/* Main Help Categories */}
                <section className="help-main-section">
                    <h2>What can we help you with?</h2>
                    <div className="support-grid">
                        <Link to="/orders" className="support-card support-card-link">
                            <div className="support-card-icon">📦</div>
                            <h3>Your Orders</h3>
                            <p>View your order history and track packages</p>
                            <span className="support-card-action">View Orders →</span>
                        </Link>

                        <Link to="/settings" className="support-card support-card-link">
                            <div className="support-card-icon">⚙️</div>
                            <h3>Account Settings</h3>
                            <p>Update password, email, and website preferences</p>
                            <span className="support-card-action">Manage Account →</span>
                        </Link>

                        <Link to="/contact" className="support-card support-card-link">
                            <div className="support-card-icon">💬</div>
                            <h3>Contact Us</h3>
                            <p>Send us a message and we'll get back to you</p>
                            <span className="support-card-action">Contact Support →</span>
                        </Link>

                        <Link to="/faq" className="support-card support-card-link">
                            <div className="support-card-icon">❓</div>
                            <h3>FAQ</h3>
                            <p>Find answers to frequently asked questions</p>
                            <span className="support-card-action">View FAQ →</span>
                        </Link>
                    </div>
                </section>

                {/* Popular Topics */}
                <section className="help-topics-section">
                    <h2>Popular Help Topics</h2>
                    <div className="topics-grid">
                        <div className="topic-category">
                            <h3>📦 Orders & Tracking</h3>
                            <ul className="help-list">
                                <li><Link to="/orders">View my orders</Link></li>
                                <li><Link to="/orders">Track my package</Link></li>
                                <li><Link to="/orders">Add comments to orders</Link></li>
                                <li><Link to="/orders">Rate purchased items</Link></li>
                            </ul>
                        </div>

                        <div className="topic-category">
                            <h3>🔐 Account Management</h3>
                            <ul className="help-list">
                                <li><Link to="/settings">Change my password</Link></li>
                                <li><Link to="/settings">Update email preferences</Link></li>
                                <li><Link to="/settings">Change language & currency</Link></li>
                                <li><Link to="/settings">Sign out of my account</Link></li>
                            </ul>
                        </div>

                        <div className="topic-category">
                            <h3>🛍️ Shopping</h3>
                            <ul className="help-list">
                                <li><Link to="/marketplace">Browse products</Link></li>
                                <li><Link to="/category/electronics">Shop by category</Link></li>
                                <li><Link to="/search">Search for products</Link></li>
                                <li><Link to="/cart">View my cart</Link></li>
                            </ul>
                        </div>

                        <div className="topic-category">
                            <h3>📞 Support</h3>
                            <ul className="help-list">
                                <li><Link to="/contact">Contact customer service</Link></li>
                                <li><Link to="/faq">Read FAQ</Link></li>
                                <li><Link to="/help">Browse help center</Link></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <Link to="/orders" className="quick-action-card">
                            <span className="quick-action-icon">📦</span>
                            <span className="quick-action-text">View Orders</span>
                        </Link>
                        <Link to="/cart" className="quick-action-card">
                            <span className="quick-action-icon">🛒</span>
                            <span className="quick-action-text">View Cart</span>
                        </Link>
                        <Link to="/settings" className="quick-action-card">
                            <span className="quick-action-icon">⚙️</span>
                            <span className="quick-action-text">Settings</span>
                        </Link>
                        <Link to="/contact" className="quick-action-card">
                            <span className="quick-action-icon">📞</span>
                            <span className="quick-action-text">Contact Us</span>
                        </Link>
                    </div>
                </section>

                {/* Additional Resources */}
                <section className="resources-section">
                    <h2>Additional Resources</h2>
                    <div className="resources-links">
                        <Link to="/faq" className="resource-link">❓ Frequently Asked Questions</Link>
                        <Link to="/contact" className="resource-link">📧 Contact Support Team</Link>
                        <Link to="/settings" className="resource-link">🔔 Email & Notification Preferences</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpCenterPage;
