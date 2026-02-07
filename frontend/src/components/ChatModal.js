import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
export const ChatModal = ({ partnerId, partnerName, isOpen, onClose, currentUserType, postId, initialMessage, inline }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (isOpen && initialMessage) {
            setNewMessage(initialMessage);
        }
        else if (!isOpen) {
            setNewMessage('');
        }
    }, [isOpen, initialMessage]);
    useEffect(() => {
        if (isOpen && partnerId) {
            loadHistory();
            // Optional: Set up polling here for real-time-like updates
            const interval = setInterval(loadHistory, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, partnerId]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const loadHistory = async () => {
        try {
            const response = await api.get(`/chat/history/${partnerId}`);
            setMessages(response.data);
        }
        catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim())
            return;
        try {
            setLoading(true);
            await api.post('/chat', {
                recipientId: partnerId,
                message: newMessage,
                postId: postId
            });
            setNewMessage('');
            loadHistory(); // Refresh immediately
        }
        catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        }
        finally {
            setLoading(false);
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: inline ? "flex flex-col h-full bg-white" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: inline ? "flex flex-col h-full" : "bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]", children: [_jsxs("div", { className: "bg-primary text-white p-4 flex justify-between items-center flex-shrink-0", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold", children: ["Chat with ", partnerName] }), _jsx("p", { className: "text-xs text-gray-200", children: "Usually replies within an hour" })] }), !inline && (_jsx("button", { onClick: onClose, className: "text-white hover:text-gray-300 font-bold text-xl", children: "\u00D7" }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4", children: [messages.length === 0 ? (_jsxs("div", { className: "text-center text-gray-400 mt-10", children: [_jsx("p", { children: "No messages yet." }), _jsx("p", { className: "text-sm", children: "Start the conversation!" })] })) : (messages.map((msg) => {
                            const isMe = msg.SenderType === currentUserType;
                            return (_jsx("div", { className: `flex ${isMe ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-secondary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`, children: [_jsx("p", { children: msg.Message }), _jsx("p", { className: `text-xs mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-500'}`, children: new Date(msg.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }) }, msg.Id));
                        })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-4 border-t bg-white flex-shrink-0", children: _jsxs("form", { onSubmit: sendMessage, className: "flex gap-2", children: [_jsx("input", { type: "text", value: newMessage, onChange: (e) => setNewMessage(e.target.value), placeholder: "Type your message...", className: "flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary outline-none", disabled: loading }), _jsx("button", { type: "submit", disabled: loading || !newMessage.trim(), className: "bg-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 w-10 h-10 flex items-center justify-center", children: "\u27A4" })] }) })] }) }));
};
