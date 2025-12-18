import React, { useState } from "react";
import "./MessagesPage.css";

function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Sample conversations with sellers
    const [conversations] = useState([
        {
            id: 1,
            seller: "TechStore Pro",
            avatar: "T",
            lastMessage: "Your order has been shipped!",
            time: "5 min ago",
            unread: 1,
            online: true,
            product: "Wireless Earbuds Pro",
            orderId: "#1234",
            messages: [
                { id: 1, sender: "buyer", text: "Hi, is this item still available?", time: "10:00 AM" },
                { id: 2, sender: "seller", text: "Yes, we have 5 in stock!", time: "10:02 AM" },
                { id: 3, sender: "buyer", text: "Great! I just placed an order.", time: "10:15 AM" },
                { id: 4, sender: "seller", text: "Thank you! We'll ship it today.", time: "10:20 AM" },
                { id: 5, sender: "seller", text: "Your order has been shipped!", time: "2:30 PM" },
            ],
        },
        {
            id: 2,
            seller: "Fashion Hub",
            avatar: "F",
            lastMessage: "Thanks for your purchase!",
            time: "1 hour ago",
            unread: 0,
            online: false,
            product: "Summer Dress Collection",
            orderId: "#1230",
            messages: [
                { id: 1, sender: "buyer", text: "Do you have this in size M?", time: "Yesterday" },
                { id: 2, sender: "seller", text: "Yes, we have M and L available.", time: "Yesterday" },
                { id: 3, sender: "seller", text: "Thanks for your purchase!", time: "Yesterday" },
            ],
        },
        {
            id: 3,
            seller: "Home Essentials",
            avatar: "H",
            lastMessage: "Let me check and get back to you",
            time: "Yesterday",
            unread: 0,
            online: true,
            product: "Kitchen Appliance Set",
            messages: [
                { id: 1, sender: "buyer", text: "Is this compatible with 220V?", time: "Yesterday" },
                { id: 2, sender: "seller", text: "Let me check and get back to you", time: "Yesterday" },
            ],
        },
        {
            id: 4,
            seller: "Sports World",
            avatar: "S",
            lastMessage: "Your return has been processed",
            time: "3 days ago",
            unread: 0,
            online: false,
            product: "Running Shoes Pro",
            orderId: "#1210",
            messages: [
                { id: 1, sender: "buyer", text: "I need to return these shoes - wrong size", time: "4 days ago" },
                { id: 2, sender: "seller", text: "No problem! I'll send you a return label.", time: "4 days ago" },
                { id: 3, sender: "seller", text: "Your return has been processed", time: "3 days ago" },
            ],
        },
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        // In a real app, this would send to backend
        setNewMessage("");
    };

    const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

    return (
        <div className="messages-page">
            {/* Page Header */}
            <div className="messages-page-header">
                <div className="header-left">
                    <h1>
                        <i className="fas fa-comments"></i> Messages
                        {totalUnread > 0 && <span className="total-unread">{totalUnread}</span>}
                    </h1>
                    <p>Chat with sellers about your orders and products</p>
                </div>
            </div>

            <div className="messages-layout">
                {/* Conversations Sidebar */}
                <div className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h2>Conversations</h2>
                    </div>
                    <div className="search-conversations">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search messages..." />
                    </div>
                    <div className="conversations-list">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""} ${conv.unread > 0 ? "unread" : ""}`}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                <div className="avatar-wrapper">
                                    <div className="conv-avatar">{conv.avatar}</div>
                                    {conv.online && <span className="online-dot"></span>}
                                </div>
                                <div className="conv-details">
                                    <div className="conv-top">
                                        <h3>{conv.seller}</h3>
                                        <span className="conv-time">{conv.time}</span>
                                    </div>
                                    <p className="conv-product">{conv.product}</p>
                                    <p className="conv-preview">{conv.lastMessage}</p>
                                </div>
                                {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-panel">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-panel-header">
                                <div className="seller-info">
                                    <div className="avatar-wrapper">
                                        <div className="conv-avatar large">{selectedConversation.avatar}</div>
                                        {selectedConversation.online && <span className="online-dot"></span>}
                                    </div>
                                    <div className="seller-details">
                                        <h3>{selectedConversation.seller}</h3>
                                        <span className={`seller-status ${selectedConversation.online ? "online" : ""}`}>
                                            {selectedConversation.online ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-meta">
                                    <span className="product-tag">
                                        <i className="fas fa-box"></i> {selectedConversation.product}
                                    </span>
                                    {selectedConversation.orderId && (
                                        <span className="order-tag">
                                            <i className="fas fa-receipt"></i> {selectedConversation.orderId}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="chat-messages">
                                {selectedConversation.messages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.sender}`}>
                                        <div className="message-bubble">
                                            <p>{msg.text}</p>
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <button type="button" className="attach-btn">
                                    <i className="fas fa-paperclip"></i>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="button" className="emoji-btn">
                                    <i className="fas fa-smile"></i>
                                </button>
                                <button type="submit" className="send-btn">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <div className="empty-state">
                                <i className="fas fa-comments"></i>
                                <h3>Select a conversation</h3>
                                <p>Choose a seller from the list to view your messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
