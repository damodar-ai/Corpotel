import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
export const HotelDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        postsCount: 0,
        bookingsCount: 0
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get posts count
                const postsResponse = await api.get('/posts/my');
                const posts = postsResponse.data || [];
                setStats({
                    postsCount: posts.length,
                    bookingsCount: 0 // TODO: Add bookings endpoint
                });
            }
            catch (error) {
                console.error('Failed to fetch stats:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    const quickActions = [
        {
            title: 'Manage Posts',
            description: 'Create and manage your hotel offers',
            icon: '📝',
            action: () => navigate('/hotel/posts'),
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'View Bookings',
            description: 'See and manage booking requests',
            icon: '📅',
            action: () => navigate('/bookings'),
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Hotel Profile',
            description: 'Update your hotel information',
            icon: '🏨',
            action: () => navigate('/complete-profile/hotel'),
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Messages',
            description: 'Chat with clients',
            icon: '💬',
            action: () => navigate('/hotel/messages'),
            color: 'from-pink-500 to-pink-600'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-3", children: "Partner Portal" }), _jsxs("div", { className: "flex justify-between items-end", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-slate-900 mb-2", children: "Hotel Dashboard" }), _jsxs("p", { className: "text-lg text-slate-500", children: ["Welcome back, ", user?.firstName || user?.email?.split('@')[0]] })] }), _jsx("div", { className: "hidden md:block", children: _jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }), "Live Partner"] }) })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12", children: [_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider", children: "Active Posts" }), _jsx("span", { className: "text-xl p-2 bg-blue-50 rounded-lg", children: "\uD83D\uDCDD" })] }), _jsx("p", { className: "text-4xl font-bold text-slate-900", children: loading ? '...' : stats.postsCount })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider", children: "Pending Bookings" }), _jsx("span", { className: "text-xl p-2 bg-amber-50 rounded-lg", children: "\uD83D\uDCC5" })] }), _jsx("p", { className: "text-4xl font-bold text-slate-900", children: loading ? '...' : stats.bookingsCount })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider", children: "Profile Status" }), _jsx("span", { className: "text-xl p-2 bg-purple-50 rounded-lg", children: "\uD83C\uDFE8" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-3 h-3 rounded-full ${user?.isProfileCompleted ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("p", { className: "text-xl font-bold text-slate-900", children: user?.isProfileCompleted ? 'Complete' : 'Incomplete' })] })] })] }), _jsx("h2", { className: "text-lg font-bold text-slate-900 mb-6", children: "Quick Actions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16", children: quickActions.map((action, index) => (_jsxs("button", { onClick: action.action, className: "bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md p-6 rounded-xl text-left transition-all duration-200 group flex flex-col h-full", children: [_jsx("div", { className: "text-3xl mb-4 p-3 bg-slate-50 w-fit rounded-xl group-hover:bg-blue-50 transition-colors", children: action.icon }), _jsx("h3", { className: "text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors", children: action.title }), _jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: action.description })] }, index))) }), _jsx("div", { className: "border-t border-slate-200 pt-12", children: _jsxs("div", { className: "bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Partner Success Guide" }), _jsx("p", { className: "text-slate-400 text-sm leading-relaxed mb-6", children: "Maximize your visibility and bookings by maintaining high corporate standards and responding quickly to inquiries." }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-blue-400 mt-1", children: "\u2713" }), _jsx("p", { className: "text-sm text-slate-300", children: "Create attractive posts with competitive corporate rates" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-blue-400 mt-1", children: "\u2713" }), _jsx("p", { className: "text-sm text-slate-300", children: "Respond to booking requests within 4 hours" })] })] })] }), _jsx("div", { className: "hidden md:block", children: _jsxs("div", { className: "bg-slate-800/50 p-6 rounded-xl border border-slate-700/50", children: [_jsx("h4", { className: "text-white font-bold mb-4 text-sm uppercase tracking-wide", children: "Performance Tips" }), _jsxs("ul", { className: "space-y-3", children: [_jsxs("li", { className: "text-xs text-slate-400 flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-green-500 rounded-full" }), "Keep your hotel profile 100% complete"] }), _jsxs("li", { className: "text-xs text-slate-400 flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-blue-500 rounded-full" }), "Offer special packages for long stays"] })] })] }) })] }), _jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" }), _jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" })] }) })] })] }));
};
