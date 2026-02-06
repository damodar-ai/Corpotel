import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

interface Message {
    Id: number;
    Message: string;
    SenderType: 'Hotel' | 'Corporate';
    CreatedAt: string;
}

interface ChatModalProps {
    partnerId: number; // The ID of the Hotel (if corp user) or Corp (if hotel user)
    partnerName: string;
    isOpen: boolean;
    onClose: () => void;
    currentUserType: 'Hotel' | 'Corporate';
    postId?: number;
    initialMessage?: string;
    inline?: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({ partnerId, partnerName, isOpen, onClose, currentUserType, postId, initialMessage, inline }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && initialMessage) {
            setNewMessage(initialMessage);
        } else if (!isOpen) {
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
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setLoading(true);

            await api.post('/chat', {
                recipientId: partnerId,
                message: newMessage,
                postId: postId
            });
            setNewMessage('');
            loadHistory(); // Refresh immediately
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!isOpen) return null;

    return (
        <div className={inline ? "flex flex-col h-full bg-white" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
            <div className={inline ? "flex flex-col h-full" : "bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]"}>
                {/* Header */}
                <div className="bg-primary text-white p-4 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="font-bold">Chat with {partnerName}</h3>
                        <p className="text-xs text-gray-200">Usually replies within an hour</p>
                    </div>
                    {!inline && (
                        <button onClick={onClose} className="text-white hover:text-gray-300 font-bold text-xl">
                            ×
                        </button>
                    )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <p>No messages yet.</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.SenderType === currentUserType;
                            return (
                                <div key={msg.Id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-secondary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                        <p>{msg.Message}</p>
                                        <p className={`text-xs mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date(msg.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white flex-shrink-0">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !newMessage.trim()}
                            className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 w-10 h-10 flex items-center justify-center"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
