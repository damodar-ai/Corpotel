import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ChatModal } from '../components/ChatModal';

interface Chat {
    ConversationId: string;
    HotelId?: number;
    HotelName?: string;
    CorporateId?: number;
    CompanyName?: string;
    HotelDetails_Id?: number;
    CorporateDetails_Id?: number;
    PostId?: number;
    HotelPosts_Id?: number;
    PostTitle?: string;
    LastMessage: string;
    LastMessageTime: string;
    SenderType: string;
}

export const ChatInboxPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [activeTab, setActiveTab] = useState<'Hotel' | 'Corporate'>(user?.identityType === 'Hotel' ? 'Corporate' : 'Hotel');

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/chat/inbox');
            setChats(response.data);
        } catch (error) {
            console.error('Failed to load inbox:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchChats();
        }
    }, [isAuthenticated]);

    const filteredChats = chats.filter(chat => {
        // If the chat has HotelId/HotelName, it's a chat with a Hotel.
        // If the chat has CorporateId/CompanyName, it's a chat with a Corporate.
        // Adjust logic based on what available data suggests.
        // Assuming the backend returns the Partner info.

        // If I am Corporate, I want to see 'Hotels'. My chats will have HotelId.
        // If I am Hotel, I want to see 'Corporate'. My chats will have CorporateId.

        // If we strictly follow the tabs:
        if (activeTab === 'Hotel') {
            // Show chats where the partner is a Hotel
            return chat.HotelName;
        }
        if (activeTab === 'Corporate') {
            // Show chats where the partner is a Corporate
            return chat.CompanyName;
        }
        return false;
    });

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-50 font-sans text-slate-900 border-t border-slate-200">
            {/* Sidebar - Chat List */}
            <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Sidebar Header */}
                <div className="p-5 border-b border-slate-100 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Inbox</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setActiveTab('Hotel')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Hotel'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Hotels
                        </button>
                        <button
                            onClick={() => setActiveTab('Corporate')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Corporate'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Corporates
                        </button>
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📭</div>
                            <p className="font-bold text-slate-700 text-sm">No messages yet</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {activeTab === 'Hotel'
                                    ? "Chats with Hotels will appear here."
                                    : "Chats with Corporate clients will appear here."}
                            </p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.ConversationId}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group items-start gap-3 flex ${selectedChat?.ConversationId === chat.ConversationId
                                    ? 'bg-blue-50 border-blue-100 shadow-sm relative z-10'
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                    }`}
                            >
                                <div className={`relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${selectedChat?.ConversationId === chat.ConversationId ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {(chat.HotelName || chat.CompanyName || '?').charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm font-bold truncate ${selectedChat?.ConversationId === chat.ConversationId ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {chat.HotelName || chat.CompanyName || 'Unknown Partner'}
                                        </h3>
                                        <span className={`text-[10px] font-medium ${selectedChat?.ConversationId === chat.ConversationId ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {new Date(chat.LastMessageTime).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {chat.PostTitle && (
                                        <div className="mb-1">
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-full inline-block">
                                                Re: {chat.PostTitle}
                                            </span>
                                        </div>
                                    )}

                                    <p className={`text-xs line-clamp-1 ${selectedChat?.ConversationId === chat.ConversationId ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                        {chat.SenderType === 'Me' ? 'You: ' : ''}{chat.LastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area - Right Pane */}
            <div className={`flex-1 flex flex-col bg-slate-50/50 ${!selectedChat ? 'hidden md:flex' : 'flex'} relative`}>
                {selectedChat ? (
                    <div className="flex flex-col h-full bg-slate-50">
                        {/* Mobile Back Button Header */}
                        <div className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center px-4 flex-shrink-0">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="mr-3 text-slate-500 hover:text-slate-800"
                            >
                                ← Back
                            </button>
                            <span className="font-bold text-slate-800 truncate">
                                {selectedChat.HotelName || selectedChat.CompanyName}
                            </span>
                        </div>

                        {/* Inline Chat Component */}
                        <div className="flex-1 relative overflow-hidden flex flex-col">
                            {/* 
                                Embedding ChatModal content logic inline. 
                                Since ChatModal is typically a modal, we wrap it to look integrated. 
                                We pass isOpen=true. 
                              */}
                            <div className="flex-1 relative">
                                <ChatModal
                                    isOpen={true}
                                    onClose={() => setSelectedChat(null)}
                                    partnerId={user?.identityType === 'Hotel'
                                        ? (selectedChat.CorporateDetails_Id || selectedChat.CorporateId)
                                        : (selectedChat.HotelDetails_Id || selectedChat.HotelId)}
                                    partnerName={selectedChat.HotelName || selectedChat.CompanyName || "Partner"}
                                    currentUserType={user?.identityType as 'Hotel' | 'Corporate'}
                                    postId={selectedChat.HotelPosts_Id || selectedChat.PostId}
                                    inline={true}
                                // Custom styling props if supported, or we rely on the component adapting to its container
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State - Corporate Hub */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                        <div className="max-w-2xl w-full text-center space-y-12 py-10">

                            {/* Hero Empty State */}
                            <div>
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mx-auto mb-8 relative">
                                    <span className="text-5xl">💬</span>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-xs">✓</div>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-3">Corporate Communication Hub</h3>
                                <p className="text-slate-500 text-lg max-w-lg mx-auto">
                                    Select a conversation from the sidebar to view details, negotiate rates, or manage your booking requests.
                                </p>
                            </div>

                            {/* Section 3: Messaging Tips */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 font-bold text-xl">⚡</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Be Responsive</h4>
                                    <p className="text-sm text-slate-500">Responding within 1 hour increases your chance of booking confirmation by 40%.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 font-bold text-xl">🤝</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Build Trust</h4>
                                    <p className="text-sm text-slate-500">Keep communication professional. Clear answers lead to long-term corporate contracts.</p>
                                </div>
                            </div>

                            {/* Section 4: Trust Badge */}
                            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Encrypted & Secure Messaging
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
