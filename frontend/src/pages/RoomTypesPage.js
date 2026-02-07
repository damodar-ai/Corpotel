import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roomTypeService } from '../services';
export const RoomTypesPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 2,
        basePrice: 100,
        corporatePrice: '',
        amenities: ''
    });
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.identityType !== 'Hotel') {
            navigate('/');
            return;
        }
        loadRoomTypes();
    }, [isAuthenticated, user, navigate]);
    const loadRoomTypes = async () => {
        try {
            setLoading(true);
            const response = await roomTypeService.getRoomTypes();
            setRoomTypes(response.data);
        }
        catch (error) {
            console.error('Failed to load room types:', error);
            setError(error.response?.data?.error || 'Failed to load room types');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = {
                name: formData.name,
                description: formData.description,
                capacity: formData.capacity,
                basePrice: formData.basePrice,
                corporatePrice: formData.corporatePrice ? parseFloat(formData.corporatePrice) : undefined,
                amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : undefined
            };
            if (editingId) {
                await roomTypeService.updateRoomType(editingId, data);
            }
            else {
                await roomTypeService.createRoomType(data);
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            loadRoomTypes();
        }
        catch (error) {
            setError(error.response?.data?.error || 'Failed to save room type');
        }
    };
    const handleEdit = (roomType) => {
        let amenitiesStr = '';
        if (roomType.Amenities) {
            try {
                const parsed = JSON.parse(roomType.Amenities);
                amenitiesStr = Array.isArray(parsed) ? parsed.join(', ') : roomType.Amenities;
            }
            catch {
                amenitiesStr = roomType.Amenities;
            }
        }
        setFormData({
            name: roomType.Name,
            description: roomType.Description || '',
            capacity: roomType.Capacity,
            basePrice: roomType.BasePrice,
            corporatePrice: roomType.CorporatePrice?.toString() || '',
            amenities: amenitiesStr
        });
        setEditingId(roomType.Id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this room type? This will also delete all associated rooms.')) {
            return;
        }
        try {
            await roomTypeService.deleteRoomType(id);
            loadRoomTypes();
        }
        catch (error) {
            setError(error.response?.data?.error || 'Failed to delete room type');
        }
    };
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            capacity: 2,
            basePrice: 100,
            corporatePrice: '',
            amenities: ''
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-3", children: "Partner Portal" }), _jsxs("div", { className: "flex justify-between items-end", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-slate-900 mb-2", children: "Room Types" }), _jsx("p", { className: "text-lg text-slate-500 max-w-2xl", children: "Define and manage your room inventory categories for corporate clients." })] }), _jsx("div", { className: "hidden md:block", children: _jsx("button", { onClick: () => { setShowForm(!showForm); setEditingId(null); resetForm(); }, className: `px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 ${showForm
                                            ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'}`, children: showForm ? 'Cancel Operation' : '+ Add New Room Type' }) })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("div", { className: "md:hidden mb-6", children: _jsx("button", { onClick: () => { setShowForm(!showForm); setEditingId(null); resetForm(); }, className: `w-full px-6 py-3 rounded-lg font-bold transition-all shadow-sm ${showForm
                                ? 'bg-white border border-slate-300 text-slate-600'
                                : 'bg-blue-600 text-white'}`, children: showForm ? 'Cancel' : '+ Add New Room Type' }) }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-3", children: [_jsx("span", { children: "\u26A0\uFE0F" }), error] })), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-blue-100 shadow-md p-6 md:p-8 mb-12 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("h2", { className: "text-xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm", children: editingId ? '✏️' : '✨' }), editingId ? 'Edit Room Type' : 'Create New Room Type'] }), _jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Name *" }), _jsx("input", { type: "text", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400", placeholder: "e.g., Executive Suite" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Capacity (Guests) *" }), _jsx("input", { type: "number", required: true, min: "1", value: formData.capacity, onChange: (e) => setFormData({ ...formData, capacity: parseInt(e.target.value) }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Base Price (\u20B9/night) *" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-2.5 text-slate-400 font-bold", children: "\u20B9" }), _jsx("input", { type: "number", required: true, min: "0", step: "0.01", value: formData.basePrice, onChange: (e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Corporate Price (\u20B9/night)" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-2.5 text-slate-400 font-bold", children: "\u20B9" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: formData.corporatePrice, onChange: (e) => setFormData({ ...formData, corporatePrice: e.target.value }), className: "w-full bg-emerald-50/50 border border-emerald-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder-slate-400", placeholder: "Optional discounted rate" })] }), _jsx("p", { className: "text-[10px] text-emerald-600 font-medium", children: "Leave empty to use base price" })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400", rows: 3, placeholder: "Briefly describe the room amenities and view..." })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Amenities" }), _jsx("input", { type: "text", value: formData.amenities, onChange: (e) => setFormData({ ...formData, amenities: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400", placeholder: "WiFi, Work Desk, City View (comma separated)" })] }), _jsxs("div", { className: "md:col-span-2 pt-4 flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-6 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", className: "bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md font-bold text-sm", children: editingId ? 'Save Changes' : 'Create Room Type' })] })] })] })] })), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3].map(i => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 h-64 animate-pulse", children: [_jsx("div", { className: "h-4 bg-slate-100 rounded w-1/2 mb-4" }), _jsx("div", { className: "h-20 bg-slate-50 rounded mb-4" }), _jsx("div", { className: "h-4 bg-slate-100 rounded w-full" })] }, i))) })) : roomTypes.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6", children: "\uD83D\uDECF\uFE0F" }), _jsx("h2", { className: "text-xl font-bold text-slate-900 mb-2", children: "No Room Types Configured" }), _jsx("p", { className: "text-slate-500 mb-8 max-w-md mx-auto", children: "Create your first room category to start accepting corporate bookings." }), _jsx("button", { onClick: () => setShowForm(true), className: "bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-bold", children: "Create First Room Type" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: roomTypes.map((rt) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col h-full", children: [_jsxs("div", { className: "p-6 flex-grow", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors", children: rt.Name }), _jsx("span", { className: `px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${rt.IsActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`, children: rt.IsActive ? 'Active' : 'Hidden' })] }), _jsx("p", { className: "text-slate-500 text-sm mb-6 leading-relaxed min-h-[40px]", children: rt.Description || 'No description provided.' }), _jsxs("div", { className: "grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-slate-100 pt-4 mb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "block text-[10px] text-slate-400 font-bold uppercase mb-1", children: "Capacity" }), _jsxs("span", { className: "font-bold text-slate-700 flex items-center gap-1", children: [_jsx("span", { children: "\uD83D\uDC65" }), " ", rt.Capacity, " Guests"] })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-[10px] text-slate-400 font-bold uppercase mb-1", children: "Standard Rate" }), _jsxs("span", { className: "font-bold text-slate-700", children: ["\u20B9", rt.BasePrice] })] }), _jsx("div", { className: "col-span-2 bg-blue-50/50 rounded-lg p-2 border border-blue-100/50", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-[10px] text-blue-600 font-bold uppercase", children: "Corporate Rate" }), _jsx("span", { className: "font-bold text-blue-700", children: rt.CorporatePrice ? `₹${rt.CorporatePrice}` : _jsx("span", { className: "text-slate-400 text-xs font-normal italic", children: "None set" }) })] }) })] }), rt.Amenities && (_jsxs("div", { className: "flex flex-wrap gap-1.5 mb-2", children: [(() => {
                                                    try {
                                                        const parsed = JSON.parse(rt.Amenities);
                                                        return Array.isArray(parsed) ? parsed.slice(0, 3).map((amenity, idx) => (_jsx("span", { className: "bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium", children: amenity }, idx))) : _jsx("span", { className: "text-xs text-slate-400", children: rt.Amenities });
                                                    }
                                                    catch {
                                                        return _jsx("span", { className: "text-xs text-slate-400 truncate", children: rt.Amenities });
                                                    }
                                                })(), rt.Amenities && (() => {
                                                    try {
                                                        const parsed = JSON.parse(rt.Amenities);
                                                        return Array.isArray(parsed) && parsed.length > 3 ? (_jsxs("span", { className: "bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium", children: ["+", parsed.length - 3] })) : null;
                                                    }
                                                    catch {
                                                        return null;
                                                    }
                                                })()] }))] }), _jsxs("div", { className: "border-t border-slate-100 p-4 flex gap-3 bg-slate-50/50 rounded-b-xl", children: [_jsx("button", { onClick: () => handleEdit(rt), className: "flex-1 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 px-3 py-2 rounded-lg transition-all text-xs font-bold shadow-sm", children: "Edit Details" }), _jsx("button", { onClick: () => handleDelete(rt.Id), className: "flex-1 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 px-3 py-2 rounded-lg transition-all text-xs font-bold shadow-sm hover:bg-red-50", children: "Remove" })] })] }, rt.Id))) })), _jsxs("div", { className: "mt-20 border-t border-slate-200 pt-16", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 text-center", children: "How Corporates View Your Room Types" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center", children: [_jsx("div", { className: "w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4", children: "\uD83D\uDD0D" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Comparison" }), _jsx("p", { className: "text-sm text-slate-500", children: "Corporates compare your rooms directly against negotiated policy caps." })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center", children: [_jsx("div", { className: "w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4", children: "\uD83C\uDFF7\uFE0F" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Clarity" }), _jsx("p", { className: "text-sm text-slate-500", children: "Clear names like \"Executive Suite\" perform 40% better than generic titles." })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center", children: [_jsx("div", { className: "w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4", children: "\uD83D\uDCBC" }), _jsx("h4", { className: "font-bold text-slate-800 mb-2", children: "Amenities" }), _jsx("p", { className: "text-sm text-slate-500", children: "Listing \"Work Desk\" & \"High-Speed WiFi\" is often mandatory for approval." })] })] })] }), _jsxs("div", { className: "mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx("span", { className: "text-blue-600", children: "\u2605" }), " Best Practices for Room Categories"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400 font-bold", children: "01" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Keep it Distinct" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Ensure each room type has a unique value proposition (e.g., View vs. Space)." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400 font-bold", children: "02" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Business Ready" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Always highlight business-friendly features in the description." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400 font-bold", children: "03" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Corporate Rates" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Offering a special corporate rate increases visibility in search results." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400 font-bold", children: "04" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Capacity Accuracy" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Strictly define guest capacity to avoid booking conflicts." })] })] })] })] }), _jsxs("div", { className: "mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-4", children: "Why Well-Defined Rooms Attract Corporates" }), _jsx("p", { className: "text-slate-500 text-sm leading-relaxed mb-6", children: "Corporate travel managers need to know exactly what their employees are getting. Standardized room types build trust and reduce support queries." }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("span", { className: "px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm", children: "Faster Approval" }), _jsx("span", { className: "px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm", children: "Higher Compliance" }), _jsx("span", { className: "px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm", children: "Repeat Bookings" })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10", children: [_jsx("h4", { className: "font-bold text-lg mb-2", children: "Did you know?" }), _jsxs("p", { className: "text-blue-100 text-sm opacity-90", children: ["Hotels with 3+ distinct room types and clear corporate pricing see a ", _jsx("strong", { children: "25% increase" }), " in corporate booking conversions."] })] }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none" })] })] }), _jsxs("div", { className: "mt-16 mb-8 text-center bg-slate-900 rounded-2xl p-10 relative overflow-hidden group", children: [_jsxs("div", { className: "relative z-10", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Manage Room Types with Ease" }), _jsx("p", { className: "text-slate-400 text-sm max-w-xl mx-auto", children: "Need to update pricing or amenities? Edit your room types anytime instantly. Changes reflect immediately across the Corporate Hotel platform." })] }), _jsx("div", { className: "absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" })] })] })] }));
};
