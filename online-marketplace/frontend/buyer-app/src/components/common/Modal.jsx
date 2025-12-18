import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                {actions && (
                    <div className="modal-footer">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
