import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Messages.css";

function Messages() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    const [conversations] = useState([
        {
            id: 1,
            customer: "Ahmed Hassan",
            avatar: "A",
            lastMessage: "Is this item still available?",
            time: "2 min ago",
            unread: 2,
            online: true,
            messages: [
                { id: 1, sender: "customer", text: "Hello! I'm interested in the Wireless Earbuds Pro.", time: "10:30 AM" },
                { id: 2, sender: "seller", text: "Hi Ahmed! Yes, they're available. Would you like more details?", time: "10:32 AM" },
                { id: 3, sender: "customer", text: "What's the battery life?", time: "10:33 AM" },
                { id: 4, sender: "seller", text: "The earbuds last 8 hours, and the case provides 3 additional charges.", time: "10:35 AM" },
                { id: 5, sender: "customer", text: "Is this item still available?", time: "10:40 AM" },
            ],
        },
        {
            id: 2,
            customer: "Sara Mohamed",
            avatar: "S",
            lastMessage: "Thank you for the quick delivery!",
            time: "1 hour ago",
            unread: 0,
            online: false,
            messages: [
                { id: 1, sender: "customer", text: "Hi, I received my order today!", time: "9:00 AM" },
                { id: 2, sender: "customer", text: "Thank you for the quick delivery!", time: "9:01 AM" },
                { id: 3, sender: "seller", text: "You're welcome! Enjoy your purchase 😊", time: "9:15 AM" },
            ],
        },
        {
            id: 3,
            customer: "Omar Ali",
            avatar: "O",
            lastMessage: "Can you ship to Alexandria?",
            time: "3 hours ago",
            unread: 1,
            online: true,
            messages: [
                { id: 1, sender: "customer", text: "Hello, do you ship to Alexandria?", time: "7:00 AM" },
                { id: 2, sender: "customer", text: "Can you ship to Alexandria?", time: "7:05 AM" },
            ],
        },
        {
            id: 4,
            customer: "Laila Ahmed",
            avatar: "L",
            lastMessage: "I'd like to return this item",
            time: "Yesterday",
            unread: 0,
            online: false,
            messages: [
                { id: 1, sender: "customer", text: "Hi, I'd like to return this item", time: "Yesterday" },
                { id: 2, sender: "seller", text: "I'm sorry to hear that. What's the issue?", time: "Yesterday" },
                { id: 3, sender: "customer", text: "It's the wrong size for me", time: "Yesterday" },
                { id: 4, sender: "seller", text: "No problem! I'll send you the return label.", time: "Yesterday" },
            ],
        },
        {
            id: 5,
            customer: "Youssef Khaled",
            avatar: "Y",
            lastMessage: "Do you have this in black?",
            time: "2 days ago",
            unread: 0,
            online: false,
            messages: [
                { id: 1, sender: "customer", text: "Do you have this in black?", time: "2 days ago" },
                { id: 2, sender: "seller", text: "Yes! We have black, white, and blue options.", time: "2 days ago" },
            ],
        },
    ]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.isAuthenticated && userData.type === "seller") {
            setUser(userData);
        } else {
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        // In a real app, this would send to backend
        setNewMessage("");
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading Messages...</p>
            </div>
        );
    }

    const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

    return (
        <div className="seller-app">
            <Sidebar />
            <div className="messages-content">
                {/* Header */}
                <div className="messages-header">
                    <div className="header-content">
                        <h1 className="messages-title">
                            <i className="fas fa-comments"></i> Messages
                            {totalUnread > 0 && <span className="unread-badge">{totalUnread}</span>}
                        </h1>
                        <p className="messages-subtitle">Communicate with your customers</p>
                    </div>
                </div>

                <div className="messages-container">
                    {/* Conversations List */}
                    <div className="conversations-list">
                        <div className="list-header">
                            <h2>Conversations</h2>
                            <button className="new-message-btn">
                                <i className="fas fa-edit"></i>
                            </button>
                        </div>
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Search messages..." />
                        </div>
                        <div className="conversations">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""} ${conv.unread > 0 ? "unread" : ""}`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <div className="avatar-container">
                                        <div className="conversation-avatar">{conv.avatar}</div>
                                        {conv.online && <span className="online-indicator"></span>}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-header">
                                            <h3>{conv.customer}</h3>
                                            <span className="conversation-time">{conv.time}</span>
                                        </div>
                                        <p className="conversation-preview">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="unread-count">{conv.unread}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        {selectedConversation ? (
                            <>
                                <div className="chat-header">
                                    <div className="chat-user">
                                        <div className="avatar-container">
                                            <div className="conversation-avatar large">{selectedConversation.avatar}</div>
                                            {selectedConversation.online && <span className="online-indicator"></span>}
                                        </div>
                                        <div className="user-info">
                                            <h3>{selectedConversation.customer}</h3>
                                            <span className={`status ${selectedConversation.online ? "online" : ""}`}>
                                                {selectedConversation.online ? "Online" : "Offline"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="chat-actions">
                                        <button className="action-icon"><i className="fas fa-phone"></i></button>
                                        <button className="action-icon"><i className="fas fa-video"></i></button>
                                        <button className="action-icon"><i className="fas fa-ellipsis-v"></i></button>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {selectedConversation.messages.map((message) => (
                                        <div key={message.id} className={`message ${message.sender}`}>
                                            <div className="message-bubble">
                                                <p>{message.text}</p>
                                                <span className="message-time">{message.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form className="chat-input" onSubmit={handleSendMessage}>
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
                            <div className="no-conversation">
                                <div className="empty-chat">
                                    <i className="fas fa-comments"></i>
                                    <h3>Select a conversation</h3>
                                    <p>Choose a conversation from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messages;
