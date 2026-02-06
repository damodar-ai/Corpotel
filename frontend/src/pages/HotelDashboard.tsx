import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const HotelDashboard: React.FC = () => {
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
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Partner Portal</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Hotel Dashboard
                            </h1>
                            <p className="text-lg text-slate-500">
                                Welcome back, {user?.firstName || user?.email?.split('@')[0]}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Live Partner
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Posts</h3>
                            <span className="text-xl p-2 bg-blue-50 rounded-lg">📝</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-900">
                            {loading ? '...' : stats.postsCount}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Bookings</h3>
                            <span className="text-xl p-2 bg-amber-50 rounded-lg">📅</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-900">
                            {loading ? '...' : stats.bookingsCount}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Profile Status</h3>
                            <span className="text-xl p-2 bg-purple-50 rounded-lg">🏨</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${user?.isProfileCompleted ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <p className="text-xl font-bold text-slate-900">
                                {user?.isProfileCompleted ? 'Complete' : 'Incomplete'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md p-6 rounded-xl text-left transition-all duration-200 group flex flex-col h-full"
                        >
                            <div className="text-3xl mb-4 p-3 bg-slate-50 w-fit rounded-xl group-hover:bg-blue-50 transition-colors">
                                {action.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {action.description}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Guidance / Tips */}
                <div className="border-t border-slate-200 pt-12">
                    <div className="bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Partner Success Guide</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Maximize your visibility and bookings by maintaining high corporate standards and responding quickly to inquiries.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-400 mt-1">✓</span>
                                        <p className="text-sm text-slate-300">Create attractive posts with competitive corporate rates</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-400 mt-1">✓</span>
                                        <p className="text-sm text-slate-300">Respond to booking requests within 4 hours</p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Performance Tips</h4>
                                    <ul className="space-y-3">
                                        <li className="text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            Keep your hotel profile 100% complete
                                        </li>
                                        <li className="text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            Offer special packages for long stays
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
