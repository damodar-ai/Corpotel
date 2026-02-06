import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roomTypeService } from '../services';

interface RoomType {
    Id: number;
    Name: string;
    Description: string;
    Capacity: number;
    BasePrice: number;
    CorporatePrice: number | null;
    Amenities: string | null;
    IsActive: boolean;
}

export const RoomTypesPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
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
        } catch (error: any) {
            console.error('Failed to load room types:', error);
            setError(error.response?.data?.error || 'Failed to load room types');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            } else {
                await roomTypeService.createRoomType(data);
            }

            setShowForm(false);
            setEditingId(null);
            resetForm();
            loadRoomTypes();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to save room type');
        }
    };

    const handleEdit = (roomType: RoomType) => {
        let amenitiesStr = '';
        if (roomType.Amenities) {
            try {
                const parsed = JSON.parse(roomType.Amenities);
                amenitiesStr = Array.isArray(parsed) ? parsed.join(', ') : roomType.Amenities;
            } catch {
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

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this room type? This will also delete all associated rooms.')) {
            return;
        }

        try {
            await roomTypeService.deleteRoomType(id);
            loadRoomTypes();
        } catch (error: any) {
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Partner Portal</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Room Types
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                Define and manage your room inventory categories for corporate clients.
                            </p>
                        </div>
                        {/* Action Button (Desktop) */}
                        <div className="hidden md:block">
                            <button
                                onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
                                className={`px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 ${showForm
                                    ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'}`}
                            >
                                {showForm ? 'Cancel Operation' : '+ Add New Room Type'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Mobile Action Button */}
                <div className="md:hidden mb-6">
                    <button
                        onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
                        className={`w-full px-6 py-3 rounded-lg font-bold transition-all shadow-sm ${showForm
                            ? 'bg-white border border-slate-300 text-slate-600'
                            : 'bg-blue-600 text-white'}`}
                    >
                        {showForm ? 'Cancel' : '+ Add New Room Type'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {/* Form Section */}
                {showForm && (
                    <div className="bg-white rounded-xl border border-blue-100 shadow-md p-6 md:p-8 mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                                    {editingId ? '✏️' : '✨'}
                                </span>
                                {editingId ? 'Edit Room Type' : 'Create New Room Type'}
                            </h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="e.g., Executive Suite"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Capacity (Guests) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Base Price (₹/night) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Corporate Price (₹/night)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.corporatePrice}
                                            onChange={(e) => setFormData({ ...formData, corporatePrice: e.target.value })}
                                            className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder-slate-400"
                                            placeholder="Optional discounted rate"
                                        />
                                    </div>
                                    <p className="text-[10px] text-emerald-600 font-medium">Leave empty to use base price</p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                                        rows={3}
                                        placeholder="Briefly describe the room amenities and view..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Amenities</label>
                                    <input
                                        type="text"
                                        value={formData.amenities}
                                        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="WiFi, Work Desk, City View (comma separated)"
                                    />
                                </div>
                                <div className="md:col-span-2 pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md font-bold text-sm"
                                    >
                                        {editingId ? 'Save Changes' : 'Create Room Type'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* List View */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-64 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                                <div className="h-20 bg-slate-50 rounded mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : roomTypes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🛏️</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Room Types Configured</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Create your first room category to start accepting corporate bookings.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-bold"
                        >
                            Create First Room Type
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roomTypes.map((rt) => (
                            <div key={rt.Id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col h-full">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rt.Name}</h3>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${rt.IsActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                            {rt.IsActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed min-h-[40px]">
                                        {rt.Description || 'No description provided.'}
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-slate-100 pt-4 mb-4">
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Capacity</span>
                                            <span className="font-bold text-slate-700 flex items-center gap-1">
                                                <span>👥</span> {rt.Capacity} Guests
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Standard Rate</span>
                                            <span className="font-bold text-slate-700">₹{rt.BasePrice}</span>
                                        </div>
                                        <div className="col-span-2 bg-blue-50/50 rounded-lg p-2 border border-blue-100/50">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-blue-600 font-bold uppercase">Corporate Rate</span>
                                                <span className="font-bold text-blue-700">
                                                    {rt.CorporatePrice ? `₹${rt.CorporatePrice}` : <span className="text-slate-400 text-xs font-normal italic">None set</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities Tags */}
                                    {rt.Amenities && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {(() => {
                                                try {
                                                    const parsed = JSON.parse(rt.Amenities);
                                                    return Array.isArray(parsed) ? parsed.slice(0, 3).map((amenity: string, idx: number) => (
                                                        <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                                                            {amenity}
                                                        </span>
                                                    )) : <span className="text-xs text-slate-400">{rt.Amenities}</span>;
                                                } catch {
                                                    return <span className="text-xs text-slate-400 truncate">{rt.Amenities}</span>;
                                                }
                                            })()}
                                            {rt.Amenities && (() => {
                                                try {
                                                    const parsed = JSON.parse(rt.Amenities);
                                                    return Array.isArray(parsed) && parsed.length > 3 ? (
                                                        <span className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                                                            +{parsed.length - 3}
                                                        </span>
                                                    ) : null;
                                                } catch { return null; }
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="border-t border-slate-100 p-4 flex gap-3 bg-slate-50/50 rounded-b-xl">
                                    <button
                                        onClick={() => handleEdit(rt)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 px-3 py-2 rounded-lg transition-all text-xs font-bold shadow-sm"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rt.Id)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 px-3 py-2 rounded-lg transition-all text-xs font-bold shadow-sm hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Section 1: How Corporates View Your Room Types */}
                <div className="mt-20 border-t border-slate-200 pt-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">How Corporates View Your Room Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
                            <h4 className="font-bold text-slate-800 mb-2">Comparison</h4>
                            <p className="text-sm text-slate-500">Corporates compare your rooms directly against negotiated policy caps.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🏷️</div>
                            <h4 className="font-bold text-slate-800 mb-2">Clarity</h4>
                            <p className="text-sm text-slate-500">Clear names like "Executive Suite" perform 40% better than generic titles.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">💼</div>
                            <h4 className="font-bold text-slate-800 mb-2">Amenities</h4>
                            <p className="text-sm text-slate-500">Listing "Work Desk" & "High-Speed WiFi" is often mandatory for approval.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Best Practices */}
                <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="text-blue-600">★</span> Best Practices for Room Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 font-bold">01</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Keep it Distinct</h4>
                                <p className="text-xs text-slate-500 mt-1">Ensure each room type has a unique value proposition (e.g., View vs. Space).</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 font-bold">02</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Business Ready</h4>
                                <p className="text-xs text-slate-500 mt-1">Always highlight business-friendly features in the description.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 font-bold">03</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Corporate Rates</h4>
                                <p className="text-xs text-slate-500 mt-1">Offering a special corporate rate increases visibility in search results.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 font-bold">04</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Capacity Accuracy</h4>
                                <p className="text-xs text-slate-500 mt-1">Strictly define guest capacity to avoid booking conflicts.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Trust Factors */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Well-Defined Rooms Attract Corporates</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Corporate travel managers need to know exactly what their employees are getting. Standardized room types build trust and reduce support queries.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">Faster Approval</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">Higher Compliance</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">Repeat Bookings</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg mb-2">Did you know?</h4>
                            <p className="text-blue-100 text-sm opacity-90">
                                Hotels with 3+ distinct room types and clear corporate pricing see a <strong>25% increase</strong> in corporate booking conversions.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    </div>
                </div>

                {/* Section 4: Management Ease */}
                <div className="mt-16 mb-8 text-center bg-slate-900 rounded-2xl p-10 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Manage Room Types with Ease</h3>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Need to update pricing or amenities? Edit your room types anytime instantly. Changes reflect immediately across the Corporate Hotel platform.
                        </p>
                    </div>
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>
        </div>
    );
};
