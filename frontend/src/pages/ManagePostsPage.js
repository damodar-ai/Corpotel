import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ChatModal } from '../components/ChatModal';
const initialFormData = {
    title: '',
    description: '',
    price: '',
    minPrice: '',
    maxPrice: '',
    availableDate: '',
    startDate: '',
    endDate: ''
};
const InquiryChatWrapper = (props) => {
    return _jsx(ChatModal, { isOpen: true, currentUserType: "Hotel", ...props });
};
const PostInquiries = ({ postId }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(() => {
        loadChats();
    }, [postId]);
    const loadChats = async () => {
        try {
            const response = await api.get(`/chat/post/${postId}`);
            setChats(response.data);
        }
        catch (error) {
            console.error('Failed to load post chats:', error);
        }
    };
    return (_jsxs("div", { className: "mt-4", children: [chats.length === 0 ? (_jsxs("div", { className: "flex items-center gap-2 text-slate-400 italic text-sm bg-slate-50 p-3 rounded-lg border border-slate-100", children: [_jsx("span", { children: "\uD83D\uDCAC" }), " No inquiries received yet."] })) : (_jsx("div", { className: "space-y-3", children: chats.map((chat) => (_jsxs("div", { className: "flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg shadow-sm hover:border-blue-300 transition-colors group", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs", children: chat.CompanyName.charAt(0) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm text-slate-800", children: chat.CompanyName }), _jsx("p", { className: "text-xs text-slate-500 truncate max-w-[150px]", children: chat.LastMessage })] })] }), _jsx("button", { onClick: () => setSelectedChat(chat), className: "text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-all", children: "Open Chat" })] }, chat.CorporateId))) })), selectedChat && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4", children: _jsxs("div", { className: "w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative", children: [_jsx("button", { onClick: () => { setSelectedChat(null); loadChats(); }, className: "absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-slate-100 transition shadow-sm", children: "\u274C" }), _jsx(InquiryChatWrapper, { partnerId: selectedChat.CorporateId, partnerName: selectedChat.CompanyName, postId: postId, onClose: () => { setSelectedChat(null); loadChats(); } })] }) }))] }));
};
export const ManagePostsPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts/my');
            setPosts(response.data || []);
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
    const handleSubmit = async (e) => {
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
            }
            else {
                await api.post('/posts', payload);
                setSuccess('Post created successfully!');
            }
            setFormData(initialFormData);
            setShowForm(false);
            setEditingPost(null);
            fetchPosts();
        }
        catch (error) {
            console.error('Save post error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to save post';
            setError(errorMessage);
        }
    };
    const handleEdit = (post) => {
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
    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?'))
            return;
        try {
            await api.delete(`/posts/${postId}`);
            setSuccess('Post deleted successfully!');
            fetchPosts();
        }
        catch (error) {
            setError(error.response?.data?.error || 'Failed to delete post');
        }
    };
    const handleCancel = () => {
        setFormData(initialFormData);
        setShowForm(false);
        setEditingPost(null);
        setError('');
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-3", children: "Partner Portal" }), _jsxs("div", { className: "flex justify-between items-end", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-slate-900 mb-2", children: "Manage Your Posts" }), _jsx("p", { className: "text-lg text-slate-500 max-w-2xl", children: "Create and optimize your offers to attract top corporate clients." })] }), !showForm && (_jsxs("button", { onClick: () => setShowForm(true), className: "bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "+" }), " Create New Post"] }))] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [success && (_jsxs("div", { className: "bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2", children: [_jsx("span", { children: "\u2705" }), " ", success] })), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2", children: [_jsx("span", { children: "\u26A0\uFE0F" }), " ", error] })), showForm && (_jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" }), _jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: editingPost ? '✏️ Edit Post' : '✨ Create New Post' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: ["Post Title ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true, className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white", placeholder: "e.g., Executive Winter Package - 20% Off" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 4, className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white", placeholder: "Describe the amenities, terms, and value proposition..." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Min Price (\u20B9)" }), _jsx("input", { type: "number", step: "0.01", value: formData.minPrice, onChange: (e) => setFormData({ ...formData, minPrice: e.target.value }), className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Max Price (\u20B9)" }), _jsx("input", { type: "number", step: "0.01", value: formData.maxPrice, onChange: (e) => setFormData({ ...formData, maxPrice: e.target.value }), className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white", placeholder: "0.00" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "End Date" }), _jsx("input", { type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), className: "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" })] })] }), _jsxs("div", { className: "flex gap-4 pt-4 border-t border-slate-100 mt-4", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200", children: editingPost ? 'Update Post' : 'Publish Post' }), _jsx("button", { type: "button", onClick: handleCancel, className: "bg-white border border-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition", children: "Cancel" })] })] })] })), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [1, 2, 3, 4].map(i => (_jsxs("div", { className: "bg-white rounded-2xl p-6 h-64 border border-slate-200 shadow-sm animate-pulse", children: [_jsx("div", { className: "h-6 bg-slate-100 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-4 bg-slate-100 rounded w-full mb-2" }), _jsx("div", { className: "h-4 bg-slate-100 rounded w-1/2" })] }, i))) })) : posts.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6", children: "\uD83D\uDCDD" }), _jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "No active posts" }), _jsx("p", { className: "text-slate-500 mb-6 max-w-sm mx-auto", children: "Create your first special offer to start attracting corporate clients to your hotel." }), !showForm && (_jsx("button", { onClick: () => setShowForm(true), className: "bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-md", children: "Create Your First Post" }))] })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16", children: posts.map((post) => (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-xl font-bold text-slate-800 leading-tight", children: post.Title }), _jsxs("div", { className: "flex gap-2 shrink-0 ml-4", children: [_jsx("button", { onClick: () => handleEdit(post), className: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition", title: "Edit Post", children: "\u270F\uFE0F" }), _jsx("button", { onClick: () => handleDelete(post.Id), className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition", title: "Delete Post", children: "\uD83D\uDDD1\uFE0F" })] })] }), _jsx("p", { className: "text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3", children: post.Description || 'No description provided.' }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 mb-6 text-sm", children: [_jsx("div", { className: "px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg font-bold", children: post.Price ? `₹${post.Price}` : `₹${post.MinPrice} - ₹${post.MaxPrice}` }), _jsxs("div", { className: "flex items-center gap-1 text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100", children: [_jsx("span", { children: "\uD83D\uDCC5" }), post.AvailableDate ? (_jsx("span", { children: new Date(post.AvailableDate).toLocaleDateString() })) : post.StartDate && post.EndDate ? (_jsxs("span", { children: [new Date(post.StartDate).toLocaleDateString(), " - ", new Date(post.EndDate).toLocaleDateString()] })) : (_jsx("span", { children: "Always available" }))] })] })] }), _jsxs("div", { className: "border-t border-slate-100 pt-4 mt-auto", children: [_jsxs("h4", { className: "font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500" }), " Corporate Inquiries"] }), _jsx(PostInquiries, { postId: post.Id })] })] }, post.Id))) })), _jsxs("div", { className: "mt-16 border-t border-slate-200 pt-16", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 text-center", children: "How Your Posts Reach Corporates" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl mb-4", children: "\uD83D\uDCE2" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Feed Visibility" }), _jsx("p", { className: "text-sm text-slate-500", children: "Your offers appear directly in the corporate dashboard feed." })] }), _jsxs("div", { className: "text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 mx-auto bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-xl mb-4", children: "\uD83D\uDD14" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Instant Alerts" }), _jsx("p", { className: "text-sm text-slate-500", children: "Subscribed companies get notified about new deals instantly." })] }), _jsxs("div", { className: "text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl mb-4", children: "\uD83D\uDCAC" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Direct Negotiation" }), _jsx("p", { className: "text-sm text-slate-500", children: "Interested managers can chat with you directly from the post." })] })] })] }), _jsx("div", { className: "mt-12 bg-slate-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative", children: _jsxs("div", { className: "relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Best Practices for Effective Posts" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "To maximize engagement, ensure your posts are clear, professional, and targeted toward business needs." }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-green-400 font-bold", children: "\u2713" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: "Clear Titles" }), _jsx("p", { className: "text-xs text-slate-400", children: "Use \"Executive Suite Warning\" instead of \"Room Offer\"." })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-green-400 font-bold", children: "\u2713" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: "Transparent Pricing" }), _jsx("p", { className: "text-xs text-slate-400", children: "Avoid hidden fees. Corporates prefer all-inclusive rates." })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-green-400 font-bold", children: "\u2713" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: "Update Regularly" }), _jsx("p", { className: "text-xs text-slate-400", children: "Remove expired offers to keep your profile fresh." })] })] })] })] }), _jsxs("div", { className: "bg-slate-800/50 rounded-xl p-6 border border-slate-700", children: [_jsx("h4", { className: "font-bold text-slate-200 mb-4 text-center", children: "Example of a Great Post" }), _jsxs("div", { className: "bg-white rounded-lg p-4 text-slate-900 shadow-md", children: [_jsx("p", { className: "font-bold text-sm mb-1", children: "Q1 Business Conference Special" }), _jsx("p", { className: "text-xs text-slate-500 mb-2", children: "Includes breakfast, high-speed WiFi, and conference room access." }), _jsxs("div", { className: "flex justify-between items-center bg-slate-50 p-2 rounded", children: [_jsx("span", { className: "text-xs font-bold text-blue-600", children: "\u20B94,500/night" }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Valid till Mar 31" })] })] })] })] }) }), _jsxs("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-100", children: [_jsxs("div", { className: "order-2 md:order-1", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "Why Consistent Posting Builds Trust" }), _jsx("p", { className: "text-sm text-slate-500 leading-relaxed mb-4", children: "Hotels that post regular updates are perceived as more active and reliable by corporate travel managers. It signals that your property is ready for business and eager to host corporate guests." }), _jsxs("ul", { className: "text-sm text-slate-700 space-y-2", children: [_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }), " Improves search visibility"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }), " Keeps your hotel top-of-mind"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }), " Showcases seasonal readiness"] })] })] }), _jsx("div", { className: "order-1 md:order-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 flex items-center justify-center", children: _jsx("span", { className: "text-6xl", children: "\uD83E\uDD1D" }) })] }), _jsxs("div", { className: "mt-8 mb-4 text-center", children: [_jsx("div", { className: "inline-block bg-slate-100 rounded-full px-6 py-2 text-slate-500 text-xs font-bold uppercase tracking-wider", children: "Manage Your Posts with Ease" }), _jsx("p", { className: "text-slate-400 text-xs mt-3 max-w-lg mx-auto", children: "All changes are updated in real-time. You can edit or delete posts anytime to manage your inventory effectively." })] })] })] }));
};
