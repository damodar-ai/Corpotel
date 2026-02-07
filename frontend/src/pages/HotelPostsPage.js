import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ChatModal } from '../components/ChatModal';
export const HotelPostsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    // Chat state
    // Chat state
    const [chatPartner, setChatPartner] = useState(null);
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts');
            setPosts(response.data.posts || []);
        }
        catch (error) {
            console.error('Failed to fetch posts:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);
    const renderStars = (count) => {
        return '⭐'.repeat(count || 0);
    };
    const handleContact = (hotelId, hotelName, postId, postTitle) => {
        setChatPartner({ id: hotelId, name: hotelName, postId, postTitle });
    };
    const [expandedPosts, setExpandedPosts] = useState({});
    const toggleExpand = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 py-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-2", children: "Corporate Privileges" }), _jsx("h1", { className: "text-2xl md:text-3xl font-bold text-slate-900 mb-2", children: "Exclusive Corporate Offers" }), _jsx("p", { className: "text-base text-slate-500 max-w-2xl", children: "Access limited-time deals, negotiated packages, and seasonal offers strictly reserved for our corporate partners." })] }), _jsxs("button", { onClick: fetchPosts, className: "bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 shadow-sm text-sm", children: [_jsx("span", { children: "\uD83D\uDD04" }), " Refresh"] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3, 4, 5, 6].map((i) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-64 animate-pulse flex flex-col", children: [_jsx("div", { className: "h-5 bg-slate-100 rounded w-3/4 mb-3" }), _jsx("div", { className: "h-3 bg-slate-100 rounded w-1/2 mb-4" }), _jsx("div", { className: "flex-1 bg-slate-50 rounded-lg mb-3" }), _jsx("div", { className: "h-8 bg-slate-100 rounded w-full" })] }, i))) })) : posts.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm", children: [_jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4", children: "\uD83C\uDFF7\uFE0F" }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-1", children: "No Active Offers" }), _jsx("p", { className: "text-slate-500 text-sm", children: "Our partners haven't posted any new deals. Check back soon!" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: posts.map((post) => {
                            const isExpanded = expandedPosts[post.Id];
                            const description = post.Description || 'Exclusive corporate package available.';
                            const shouldClamp = description.length > 100; // heuristic for showing read more
                            return (_jsxs("div", { className: `bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden ${isExpanded ? 'h-auto' : 'h-full'}`, children: [_jsx("div", { className: "bg-blue-600 h-1.5 w-full" }), _jsxs("div", { className: "p-5 flex-grow flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "min-w-0 pr-2", children: [_jsx("h3", { className: "text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate", children: post.Title }), _jsx("p", { className: "text-slate-500 text-xs font-medium mt-0.5 uppercase tracking-wide truncate", children: post.HotelName })] }), _jsx("div", { className: "bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0", children: renderStars(post.StarCategory) })] }), _jsxs("div", { className: "flex items-center gap-1.5 mb-3 text-xs text-slate-500", children: [_jsx("span", { children: "\uD83D\uDCCD" }), " ", _jsx("span", { className: "truncate", children: post.City })] }), _jsxs("div", { className: "bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100 flex-grow", children: [_jsxs("p", { className: `text-slate-600 text-xs italic leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`, children: ["\"", description, "\""] }), shouldClamp && (_jsx("button", { onClick: (e) => { e.stopPropagation(); toggleExpand(post.Id); }, className: "text-blue-600 text-xs font-bold mt-2 hover:underline focus:outline-none", children: isExpanded ? 'Read Less' : 'Read More...' }))] }), _jsxs("div", { className: "mt-auto", children: [_jsxs("div", { className: "flex items-end justify-between mb-4 border-b border-slate-100 pb-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase", children: "Offer Price" }), _jsx("div", { className: "text-xl font-bold text-slate-900", children: post.Price ? `₹${post.Price}` : `₹${post.MinPrice} - ₹${post.MaxPrice}` })] }), _jsx("div", { className: "text-right", children: post.AvailableDate ? (_jsxs("div", { className: "text-[10px] text-slate-500", children: [_jsx("span", { className: "block font-bold", children: "Valid On" }), new Date(post.AvailableDate).toLocaleDateString()] })) : post.StartDate && post.EndDate ? (_jsxs("div", { className: "text-[10px] text-slate-500", children: [_jsx("span", { className: "block font-bold", children: "Expires" }), new Date(post.EndDate).toLocaleDateString()] })) : null })] }), _jsxs("button", { onClick: () => handleContact(post.HotelDetails_Id, post.HotelName, post.Id, post.Title), className: "w-full bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform active:scale-[0.98] duration-200", children: [_jsx("span", { children: "\uD83D\uDCAC" }), " Inquire"] })] })] })] }, post.Id));
                        }) })), _jsxs("div", { className: "border-t border-slate-200 mt-12 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-slate-900 mb-4 flex items-center gap-2", children: [_jsx("span", { className: "w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs", children: "\uD83D\uDC8E" }), "Why Corporate Offers Matter"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "p-1.5 bg-slate-50 rounded-lg h-fit text-lg", children: "\uD83D\uDCC9" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-xs", children: "Direct Savings" }), _jsx("p", { className: "text-slate-500 text-xs mt-0.5", children: "Rates strictly lower than public platforms." })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "p-1.5 bg-slate-50 rounded-lg h-fit text-lg", children: "\uD83C\uDF81" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-xs", children: "Value Added Services" }), _jsx("p", { className: "text-slate-500 text-xs mt-0.5", children: "Includes perks like transfers & meals." })] })] })] })] }), _jsxs("div", { className: "bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden h-fit", children: [_jsxs("div", { className: "relative z-10", children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 mb-2", children: "Transparent & Verified Deals" }), _jsx("p", { className: "text-slate-500 text-xs mb-4 leading-relaxed", children: "We verify every offer to ensure corporate standards compliance." }), _jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500" }), "Live Updates"] })] }), _jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 z-0" })] })] })] }), chatPartner && (_jsx(ChatModal, { isOpen: !!chatPartner, onClose: () => setChatPartner(null), partnerId: chatPartner.id, partnerName: chatPartner.name, postId: chatPartner.postId, initialMessage: chatPartner.postTitle ? `I'm interested in your offer: ${chatPartner.postTitle}` : undefined, currentUserType: user?.identityType }))] }));
};
