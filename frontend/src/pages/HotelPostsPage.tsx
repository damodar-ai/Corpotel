import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ChatModal } from '../components/ChatModal';

interface Post {
    Id: number;
    HotelDetails_Id: number;
    Title: string;
    Description: string;
    Price: number;
    MinPrice?: number;
    MaxPrice?: number;
    AvailableDate: string;
    StartDate?: string;
    EndDate?: string;
    HotelName: string;
    City: string;
    StarCategory: number;
    ContactNumber: string;
    ContactEmail: string;
    CreatedAt: string;
}

export const HotelPostsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Chat state
    // Chat state
    const [chatPartner, setChatPartner] = useState<{ id: number, name: string, postId?: number, postTitle?: string } | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts');
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderStars = (count: number) => {
        return '⭐'.repeat(count || 0);
    };

    const handleContact = (hotelId: number, hotelName: string, postId?: number, postTitle?: string) => {
        setChatPartner({ id: hotelId, name: hotelName, postId, postTitle });
    };

    const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});

    const toggleExpand = (postId: number) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Page Header - Compacted */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-2">Corporate Privileges</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                Exclusive Corporate Offers
                            </h1>
                            <p className="text-base text-slate-500 max-w-2xl">
                                Access limited-time deals, negotiated packages, and seasonal offers strictly reserved for our corporate partners.
                            </p>
                        </div>
                        <button
                            onClick={fetchPosts}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 shadow-sm text-sm"
                        >
                            <span>🔄</span> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Posts Grid - Higher Density */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-64 animate-pulse flex flex-col">
                                <div className="h-5 bg-slate-100 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                                <div className="flex-1 bg-slate-50 rounded-lg mb-3"></div>
                                <div className="h-8 bg-slate-100 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🏷️</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Offers</h3>
                        <p className="text-slate-500 text-sm">Our partners haven't posted any new deals. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const isExpanded = expandedPosts[post.Id];
                            const description = post.Description || 'Exclusive corporate package available.';
                            const shouldClamp = description.length > 100; // heuristic for showing read more

                            return (
                                <div key={post.Id} className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden ${isExpanded ? 'h-auto' : 'h-full'}`}>
                                    {/* Seasonal/Offer Banner Strip */}
                                    <div className="bg-blue-600 h-1.5 w-full"></div>

                                    <div className="p-5 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="min-w-0 pr-2">
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                    {post.Title}
                                                </h3>
                                                <p className="text-slate-500 text-xs font-medium mt-0.5 uppercase tracking-wide truncate">
                                                    {post.HotelName}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                                                {renderStars(post.StarCategory)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500">
                                            <span>📍</span> <span className="truncate">{post.City}</span>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100 flex-grow">
                                            <p className={`text-slate-600 text-xs italic leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                                "{description}"
                                            </p>
                                            {shouldClamp && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleExpand(post.Id); }}
                                                    className="text-blue-600 text-xs font-bold mt-2 hover:underline focus:outline-none"
                                                >
                                                    {isExpanded ? 'Read Less' : 'Read More...'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-end justify-between mb-4 border-b border-slate-100 pb-3">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Offer Price</p>
                                                    <div className="text-xl font-bold text-slate-900">
                                                        {post.Price ? `₹${post.Price}` : `₹${post.MinPrice} - ₹${post.MaxPrice}`}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {post.AvailableDate ? (
                                                        <div className="text-[10px] text-slate-500">
                                                            <span className="block font-bold">Valid On</span>
                                                            {new Date(post.AvailableDate).toLocaleDateString()}
                                                        </div>
                                                    ) : post.StartDate && post.EndDate ? (
                                                        <div className="text-[10px] text-slate-500">
                                                            <span className="block font-bold">Expires</span>
                                                            {new Date(post.EndDate).toLocaleDateString()}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleContact(post.HotelDetails_Id, post.HotelName, post.Id, post.Title)}
                                                className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform active:scale-[0.98] duration-200"
                                            >
                                                <span>💬</span> Inquire
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* New Guidance Sections - Compacted */}
                <div className="border-t border-slate-200 mt-12 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section 1: Value Prop */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">💎</span>
                            Why Corporate Offers Matter
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="p-1.5 bg-slate-50 rounded-lg h-fit text-lg">📉</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-xs">Direct Savings</h4>
                                    <p className="text-slate-500 text-xs mt-0.5">Rates strictly lower than public platforms.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="p-1.5 bg-slate-50 rounded-lg h-fit text-lg">🎁</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-xs">Value Added Services</h4>
                                    <p className="text-slate-500 text-xs mt-0.5">Includes perks like transfers & meals.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Transparency */}
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden h-fit">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-900 mb-2">Transparent & Verified Deals</h3>
                            <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                                We verify every offer to ensure corporate standards compliance.
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Live Updates
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 z-0"></div>
                    </div>
                </div>

            </div>

            {/* Chat Modal */}
            {chatPartner && (
                <ChatModal
                    isOpen={!!chatPartner}
                    onClose={() => setChatPartner(null)}
                    partnerId={chatPartner.id}
                    partnerName={chatPartner.name}
                    postId={chatPartner.postId}
                    initialMessage={chatPartner.postTitle ? `I'm interested in your offer: ${chatPartner.postTitle}` : undefined}
                    currentUserType={user?.identityType as any}
                />
            )}
        </div>
    );
};

