import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ChatModal } from '../components/ChatModal';
export const ChatInboxPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [activeTab, setActiveTab] = useState(user?.identityType === 'Hotel' ? 'Corporate' : 'Hotel');
    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/chat/inbox');
            setChats(response.data);
        }
        catch (error) {
            console.error('Failed to load inbox:', error);
        }
        finally {
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
    return (_jsxs("div", { className: "flex h-[calc(100vh-64px)] bg-slate-50 font-sans text-slate-900 border-t border-slate-200", children: [_jsxs("div", { className: `w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`, children: [_jsxs("div", { className: "p-5 border-b border-slate-100 bg-white", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Messages" }), _jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded", children: "Inbox" })] }), _jsxs("div", { className: "flex p-1 bg-slate-100 rounded-xl", children: [_jsx("button", { onClick: () => setActiveTab('Hotel'), className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Hotel'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'}`, children: "Hotels" }), _jsx("button", { onClick: () => setActiveTab('Corporate'), className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Corporate'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'}`, children: "Corporates" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2", children: loading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map(i => (_jsx("div", { className: "h-20 bg-slate-50 rounded-xl animate-pulse" }, i))) })) : filteredChats.length === 0 ? (_jsxs("div", { className: "text-center py-10 px-4", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl", children: "\uD83D\uDCED" }), _jsx("p", { className: "font-bold text-slate-700 text-sm", children: "No messages yet" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: activeTab === 'Hotel'
                                        ? "Chats with Hotels will appear here."
                                        : "Chats with Corporate clients will appear here." })] })) : (filteredChats.map((chat) => (_jsxs("div", { onClick: () => setSelectedChat(chat), className: `p-4 rounded-xl cursor-pointer transition-all duration-200 border group items-start gap-3 flex ${selectedChat?.ConversationId === chat.ConversationId
                                ? 'bg-blue-50 border-blue-100 shadow-sm relative z-10'
                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`, children: [_jsx("div", { className: `relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${selectedChat?.ConversationId === chat.ConversationId ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`, children: (chat.HotelName || chat.CompanyName || '?').charAt(0) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h3", { className: `text-sm font-bold truncate ${selectedChat?.ConversationId === chat.ConversationId ? 'text-slate-900' : 'text-slate-700'}`, children: chat.HotelName || chat.CompanyName || 'Unknown Partner' }), _jsx("span", { className: `text-[10px] font-medium ${selectedChat?.ConversationId === chat.ConversationId ? 'text-blue-600' : 'text-slate-400'}`, children: new Date(chat.LastMessageTime).toLocaleDateString() })] }), chat.PostTitle && (_jsx("div", { className: "mb-1", children: _jsxs("span", { className: "text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-full inline-block", children: ["Re: ", chat.PostTitle] }) })), _jsxs("p", { className: `text-xs line-clamp-1 ${selectedChat?.ConversationId === chat.ConversationId ? 'text-slate-800 font-medium' : 'text-slate-500'}`, children: [chat.SenderType === 'Me' ? 'You: ' : '', chat.LastMessage] })] })] }, chat.ConversationId)))) })] }), _jsx("div", { className: `flex-1 flex flex-col bg-slate-50/50 ${!selectedChat ? 'hidden md:flex' : 'flex'} relative`, children: selectedChat ? (_jsxs("div", { className: "flex flex-col h-full bg-slate-50", children: [_jsxs("div", { className: "md:hidden h-14 bg-white border-b border-slate-200 flex items-center px-4 flex-shrink-0", children: [_jsx("button", { onClick: () => setSelectedChat(null), className: "mr-3 text-slate-500 hover:text-slate-800", children: "\u2190 Back" }), _jsx("span", { className: "font-bold text-slate-800 truncate", children: selectedChat.HotelName || selectedChat.CompanyName })] }), _jsx("div", { className: "flex-1 relative overflow-hidden flex flex-col", children: _jsx("div", { className: "flex-1 relative", children: _jsx(ChatModal, { isOpen: true, onClose: () => setSelectedChat(null), partnerId: user?.identityType === 'Hotel'
                                        ? (selectedChat.CorporateDetails_Id || selectedChat.CorporateId)
                                        : (selectedChat.HotelDetails_Id || selectedChat.HotelId), partnerName: selectedChat.HotelName || selectedChat.CompanyName || "Partner", currentUserType: user?.identityType, postId: selectedChat.HotelPosts_Id || selectedChat.PostId, inline: true }) }) })] })) : (
                /* Empty State - Corporate Hub */
                _jsx("div", { className: "flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-y-auto", children: _jsxs("div", { className: "max-w-2xl w-full text-center space-y-12 py-10", children: [_jsxs("div", { children: [_jsxs("div", { className: "w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mx-auto mb-8 relative", children: [_jsx("span", { className: "text-5xl", children: "\uD83D\uDCAC" }), _jsx("div", { className: "absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-xs", children: "\u2713" })] }), _jsx("h3", { className: "text-3xl font-bold text-slate-900 mb-3", children: "Corporate Communication Hub" }), _jsx("p", { className: "text-slate-500 text-lg max-w-lg mx-auto", children: "Select a conversation from the sidebar to view details, negotiate rates, or manage your booking requests." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-left", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 font-bold text-xl", children: "\u26A1" }), _jsx("h4", { className: "font-bold text-slate-900 mb-2", children: "Be Responsive" }), _jsx("p", { className: "text-sm text-slate-500", children: "Responding within 1 hour increases your chance of booking confirmation by 40%." })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 font-bold text-xl", children: "\uD83E\uDD1D" }), _jsx("h4", { className: "font-bold text-slate-900 mb-2", children: "Build Trust" }), _jsx("p", { className: "text-sm text-slate-500", children: "Keep communication professional. Clear answers lead to long-term corporate contracts." })] })] }), _jsxs("div", { className: "inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm", children: [_jsxs("div", { className: "flex -space-x-2", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-slate-200 border-2 border-white" }), _jsx("div", { className: "w-6 h-6 rounded-full bg-slate-300 border-2 border-white" }), _jsx("div", { className: "w-6 h-6 rounded-full bg-slate-400 border-2 border-white" })] }), _jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Encrypted & Secure Messaging" })] })] }) })) })] }));
};
