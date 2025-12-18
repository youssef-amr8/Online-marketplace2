import React, { useState } from 'react';
import './SupportPages.css';

const ContactUsPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="support-page">
                <h1>Contact Us</h1>
                <div className="support-content">
                    <div className="success-message">
                        <h3>Thank you for contacting us!</h3>
                        <p>We have received your message and will respond within 24 hours.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="support-page">
            <h1>Contact Us</h1>
            <div className="support-content">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Topic</label>
                        <select className="settings-input">
                            <option>Order Issue</option>
                            <option>Product Question</option>
                            <option>Technical Support</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea className="settings-input" rows="5" required placeholder="Describe your issue..."></textarea>
                    </div>
                    <button type="submit" className="amazon-btn amazon-btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsPage;
