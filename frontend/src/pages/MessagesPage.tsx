import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Mock Data for UI Logic
const MOCK_CONVERSATIONS = [
    {
        id: 1,
        hotelName: "Grand Hyatt Mumbai",
        context: "Booking #BK-7892",
        lastMessage: "The conference room has been reserved for your team as requested.",
        time: "10:42 AM",
        unread: true,
        bg: "bg-blue-100",
        text: "text-blue-700"
    },
    {
        id: 2,
        hotelName: "Taj Lands End",
        context: "Inquiry: Corp Package",
        lastMessage: "Yes, we can include airport transfers in the negotiated rate.",
        time: "Yesterday",
        unread: false,
        bg: "bg-emerald-100",
        text: "text-emerald-700"
    },
    {
        id: 3,
        hotelName: "Sheraton New Delhi",
        context: "Past Stay - Invoice",
        lastMessage: "Please find the updated GST invoice attached for last week's stay.",
        time: "Oct 24",
        unread: false,
        bg: "bg-purple-100",
        text: "text-purple-700"
    }
];

const MOCK_MESSAGES = [
    { id: 1, sender: 'hotel', text: "Hello! Thank you for your inquiry regarding the corporate suite package.", time: "9:00 AM" },
    { id: 2, sender: 'me', text: "Hi, I wanted to check if the breakfast buffet is included in the rate for 20 employees?", time: "9:15 AM" },
    { id: 3, sender: 'hotel', text: "Yes, absolutely. The package includes full buffet breakfast and high-speed WiFi for all guests.", time: "9:20 AM" },
    { id: 4, sender: 'me', text: "Great. Also, do you have a conference room available for 3 hours on the 15th?", time: "9:35 AM" },
    { id: 5, sender: 'hotel', text: "Let me check the availability for you immediately.", time: "9:36 AM" },
    { id: 6, sender: 'hotel', text: "The conference room has been reserved for your team as requested.", time: "10:42 AM" }
];

export const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    const [activeConvId, setActiveConvId] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState('');

    const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === activeConvId);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-50 font-sans text-slate-900 border-t border-slate-200">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span>💬</span> Messages
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbox</span>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {MOCK_CONVERSATIONS.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${activeConvId === conv.id
                                ? 'bg-blue-50 border-blue-100 shadow-sm'
                                : 'hover:bg-slate-50 hover:border-slate-100'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${conv.unread ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                                    <h3 className={`text-sm font-bold ${activeConvId === conv.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {conv.hotelName}
                                    </h3>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{conv.time}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2 ml-4">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${conv.bg} ${conv.text}`}>
                                    {conv.context}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 ml-4 line-clamp-2 leading-relaxed">
                                {conv.id === 1 ? "You: " : ""}{conv.lastMessage}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-slate-50 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveConvId(null)}
                                    className="md:hidden text-slate-400 hover:text-slate-600 text-xl"
                                >
                                    ←
                                </button>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        {activeConversation.hotelName}
                                        <span className="text-blue-600 text-[10px] bg-blue-50 px-1.5 py-0.5 rounded-full">✓ Verified Partner</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span>Context:</span>
                                        <span className="font-semibold text-slate-700">{activeConversation.context}</span>
                                    </p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">More options</span>
                                ⋯
                            </button>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Sticky Date Divider */}
                            <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Today
                                </span>
                            </div>

                            {MOCK_MESSAGES.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[80%] md:max-w-[60%] flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${msg.sender === 'me'
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="max-w-4xl mx-auto flex gap-3">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
                                    📎
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                                    />
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                                    Send
                                    <span className="text-xs">➤</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State - No Chat Selected */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                            <span className="text-4xl">💬</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Corporate Communication Hub</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            Select a conversation from the sidebar to view details, negotiate rates, or manage your booking requests.
                        </p>
                        <div className="flex gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Secure & Encrypted
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
