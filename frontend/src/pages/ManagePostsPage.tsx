import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ChatModal } from '../components/ChatModal';

interface Post {
    Id: number;
    Title: string;
    Description: string;
    Price: number;
    MinPrice?: number;
    MaxPrice?: number;
    AvailableDate: string;
    StartDate?: string;
    EndDate?: string;
    CreatedAt: string;
}

interface PostFormData {
    title: string;
    description: string;
    price: string;
    minPrice: string;
    maxPrice: string;
    availableDate: string;
    startDate: string;
    endDate: string;
}

const initialFormData: PostFormData = {
    title: '',
    description: '',
    price: '',
    minPrice: '',
    maxPrice: '',
    availableDate: '',
    startDate: '',
    endDate: ''
};

const InquiryChatWrapper = (props: any) => {
    return <ChatModal isOpen={true} currentUserType="Hotel" {...props} />;
};

const PostInquiries: React.FC<{ postId: number }> = ({ postId }) => {
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);

    useEffect(() => {
        loadChats();
    }, [postId]);

    const loadChats = async () => {
        try {
            const response = await api.get(`/chat/post/${postId}`);
            setChats(response.data);
        } catch (error) {
            console.error('Failed to load post chats:', error);
        }
    };

    return (
        <div className="mt-4">
            {chats.length === 0 ? (
                <div className="flex items-center gap-2 text-slate-400 italic text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span>💬</span> No inquiries received yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {chats.map((chat) => (
                        <div key={chat.CorporateId} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg shadow-sm hover:border-blue-300 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                    {chat.CompanyName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{chat.CompanyName}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{chat.LastMessage}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedChat(chat)}
                                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Open Chat
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => { setSelectedChat(null); loadChats(); }}
                            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-slate-100 transition shadow-sm"
                        >
                            ❌
                        </button>
                        <InquiryChatWrapper
                            partnerId={selectedChat.CorporateId}
                            partnerName={selectedChat.CompanyName}
                            postId={postId}
                            onClose={() => { setSelectedChat(null); loadChats(); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export const ManagePostsPage: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState<PostFormData>(initialFormData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts/my');
            setPosts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: formData.price ? parseFloat(formData.price) : null,
                minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
                maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
                availableDate: formData.availableDate || null,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null
            };

            if (editingPost) {
                await api.put(`/posts/${editingPost.Id}`, payload);
                setSuccess('Post updated successfully!');
            } else {
                await api.post('/posts', payload);
                setSuccess('Post created successfully!');
            }

            setFormData(initialFormData);
            setShowForm(false);
            setEditingPost(null);
            fetchPosts();
        } catch (error: any) {
            console.error('Save post error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to save post';
            setError(errorMessage);
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.Title,
            description: post.Description || '',
            price: post.Price ? post.Price.toString() : '',
            minPrice: post.MinPrice ? post.MinPrice.toString() : '',
            maxPrice: post.MaxPrice ? post.MaxPrice.toString() : '',
            availableDate: post.AvailableDate ? post.AvailableDate.split('T')[0] : '',
            startDate: post.StartDate ? post.StartDate.split('T')[0] : '',
            endDate: post.EndDate ? post.EndDate.split('T')[0] : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await api.delete(`/posts/${postId}`);
            setSuccess('Post deleted successfully!');
            fetchPosts();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to delete post');
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setShowForm(false);
        setEditingPost(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Partner Portal</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Manage Your Posts
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                Create and optimize your offers to attract top corporate clients.
                            </p>
                        </div>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
                            >
                                <span className="text-xl">+</span> Create New Post
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <span>✅</span> {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            {editingPost ? '✏️ Edit Post' : '✨ Create New Post'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Post Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                                    placeholder="e.g., Executive Winter Package - 20% Off"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                                    placeholder="Describe the amenities, terms, and value proposition..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Min Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.minPrice}
                                        onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Max Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.maxPrice}
                                        onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    {editingPost ? 'Update Post' : 'Publish Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-white border border-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 h-64 border border-slate-200 shadow-sm animate-pulse">
                                <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">📝</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No active posts</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create your first special offer to start attracting corporate clients to your hotel.</p>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-md"
                            >
                                Create Your First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                        {posts.map((post) => (
                            <div key={post.Id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 leading-tight">{post.Title}</h3>
                                        <div className="flex gap-2 shrink-0 ml-4">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit Post"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.Id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Post"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                                        {post.Description || 'No description provided.'}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                                        <div className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg font-bold">
                                            {post.Price ? `₹${post.Price}` : `₹${post.MinPrice} - ₹${post.MaxPrice}`}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                            <span>📅</span>
                                            {post.AvailableDate ? (
                                                <span>{new Date(post.AvailableDate).toLocaleDateString()}</span>
                                            ) : post.StartDate && post.EndDate ? (
                                                <span>{new Date(post.StartDate).toLocaleDateString()} - {new Date(post.EndDate).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Always available</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 mt-auto">
                                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Corporate Inquiries
                                    </h4>
                                    <PostInquiries postId={post.Id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- GUIDANCE SECTIONS --- */}

                {/* Section 1: How Your Posts Reach Corporates */}
                <div className="mt-16 border-t border-slate-200 pt-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">How Your Posts Reach Corporates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl mb-4">📢</div>
                            <h4 className="font-bold text-slate-800 mb-2">Feed Visibility</h4>
                            <p className="text-sm text-slate-500">Your offers appear directly in the corporate dashboard feed.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 mx-auto bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-xl mb-4">🔔</div>
                            <h4 className="font-bold text-slate-800 mb-2">Instant Alerts</h4>
                            <p className="text-sm text-slate-500">Subscribed companies get notified about new deals instantly.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl mb-4">💬</div>
                            <h4 className="font-bold text-slate-800 mb-2">Direct Negotiation</h4>
                            <p className="text-sm text-slate-500">Interested managers can chat with you directly from the post.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Best Practices */}
                <div className="mt-12 bg-slate-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Best Practices for Effective Posts</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                To maximize engagement, ensure your posts are clear, professional, and targeted toward business needs.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <div>
                                        <p className="font-bold text-sm">Clear Titles</p>
                                        <p className="text-xs text-slate-400">Use "Executive Suite Warning" instead of "Room Offer".</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <div>
                                        <p className="font-bold text-sm">Transparent Pricing</p>
                                        <p className="text-xs text-slate-400">Avoid hidden fees. Corporates prefer all-inclusive rates.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <div>
                                        <p className="font-bold text-sm">Update Regularly</p>
                                        <p className="text-xs text-slate-400">Remove expired offers to keep your profile fresh.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h4 className="font-bold text-slate-200 mb-4 text-center">Example of a Great Post</h4>
                            <div className="bg-white rounded-lg p-4 text-slate-900 shadow-md">
                                <p className="font-bold text-sm mb-1">Q1 Business Conference Special</p>
                                <p className="text-xs text-slate-500 mb-2">Includes breakfast, high-speed WiFi, and conference room access.</p>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-xs font-bold text-blue-600">₹4,500/night</span>
                                    <span className="text-[10px] text-slate-400">Valid till Mar 31</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Trust & Consistency */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-100">
                    <div className="order-2 md:order-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Why Consistent Posting Builds Trust</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                            Hotels that post regular updates are perceived as more active and reliable by corporate travel managers. It signals that your property is ready for business and eager to host corporate guests.
                        </p>
                        <ul className="text-sm text-slate-700 space-y-2">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Improves search visibility</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Keeps your hotel top-of-mind</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Showcases seasonal readiness</li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 flex items-center justify-center">
                        <span className="text-6xl">🤝</span>
                    </div>
                </div>

                {/* Section 4: Manage with Ease */}
                <div className="mt-8 mb-4 text-center">
                    <div className="inline-block bg-slate-100 rounded-full px-6 py-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        Manage Your Posts with Ease
                    </div>
                    <p className="text-slate-400 text-xs mt-3 max-w-lg mx-auto">
                        All changes are updated in real-time. You can edit or delete posts anytime to manage your inventory effectively.
                    </p>
                </div>

            </div>
        </div>
    );
};
