import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';

interface Booking {
    Id: number;
    BookingNumber: string;
    GuestName: string;
    GuestEmail: string;
    GuestPhone: string;
    roomTypeName: string;
    CheckInDate: string;
    CheckOutDate: string;
    TotalPrice: number;
    BookingStatus: string;
    SpecialRequests: string;
    corporateName: string;
    CreatedAt: string;
}

export const HotelBookingsPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.identityType !== 'Hotel') {
            navigate('/');
            return;
        }
        loadBookings();
    }, [isAuthenticated, user, navigate, filter]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getHotelBookings(filter || undefined);
            setBookings(response.data);
        } catch (error: any) {
            console.error('Failed to load bookings:', error);
            setError(error.response?.data?.error || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm('Are you sure you want to approve this booking?')) {
            return;
        }

        try {
            await bookingService.approveBooking(id);
            loadBookings();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to approve booking');
        }
    };

    const handleReject = async () => {
        if (!selectedBooking) return;

        try {
            await bookingService.rejectBooking(selectedBooking.Id, rejectReason);
            setShowRejectModal(false);
            setSelectedBooking(null);
            setRejectReason('');
            loadBookings();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to reject booking');
        }
    };

    const openRejectModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowRejectModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const pendingCount = bookings.filter(b => b.BookingStatus === 'pending').length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Partner Portal</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Booking Requests
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                Manage and track incoming corporate booking requests efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center justify-between shadow-sm">
                        <span className="flex items-center gap-2 font-medium">⚠️ {error}</span>
                        <button onClick={() => setError('')} className="font-bold hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors">×</button>
                    </div>
                )}

                {/* Filters / Tabs */}
                <div className="mb-8 border-b border-slate-200">
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {['', 'pending', 'confirmed', 'rejected', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap border-b-2 ${filter === status
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All Bookings'}
                                {status === 'pending' && pendingCount > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${filter === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-40 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📅</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Bookings Found</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            {filter ? `You have no ${filter} bookings at the moment.` : 'Incoming corporate bookings will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.Id} className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${booking.BookingStatus === 'pending' ? 'border-amber-200 shadow-amber-50' : 'border-slate-200 shadow-sm'}`}>
                                <div className="p-5 md:p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    #{booking.BookingNumber}
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusColor(booking.BookingStatus)}`}>
                                                    {booking.BookingStatus}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                                <span className="text-slate-400">📅</span> Requested: {new Date(booking.CreatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {booking.BookingStatus === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(booking.Id)}
                                                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition font-bold text-sm shadow-sm flex items-center gap-2"
                                                >
                                                    <span>✓</span> Approve
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(booking)}
                                                    className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-bold text-sm shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Company & Guest</p>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mt-1">
                                                    {booking.GuestName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{booking.GuestName}</p>
                                                    <p className="text-xs text-slate-500 mb-1">{booking.corporateName || 'Individual Bookings'}</p>
                                                    <p className="text-xs text-blue-600 font-medium">{booking.GuestEmail}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Room Details</p>
                                            <div className="flex items-start gap-2">
                                                <span className="text-lg">🛏️</span>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{booking.roomTypeName}</p>
                                                    <p className="text-xs text-slate-500">{booking.SpecialRequests ? 'Has Special Requests' : 'Standard Booking'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Stay Dates</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-flex">
                                                <span>{new Date(booking.CheckInDate).toLocaleDateString()}</span>
                                                <span className="text-slate-300">→</span>
                                                <span>{new Date(booking.CheckOutDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="md:text-right">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Total Value</p>
                                            <p className="text-xl font-bold text-slate-900">₹{booking.TotalPrice.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400">Includes taxes & fees</p>
                                        </div>
                                    </div>

                                    {booking.SpecialRequests && (
                                        <div className="mt-4 flex gap-2 items-start bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm">
                                            <span className="text-amber-500 mt-0.5">📝</span>
                                            <div>
                                                <span className="font-bold text-amber-900 text-xs uppercase block mb-0.5">Guest Request</span>
                                                <p className="text-amber-800 italic">"{booking.SpecialRequests}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- NEW GUIDANCE SECTIONS --- */}

                {/* Section 1: Process Flow */}
                <div className="mt-20 border-t border-slate-200 pt-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">How Corporate Booking Processing Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center z-10">
                            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">1</div>
                            <h4 className="font-bold text-slate-800 mb-2">Review Request</h4>
                            <p className="text-sm text-slate-500">Check availability and room capacity for the requested dates.</p>
                        </div>
                        <div className="relative p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center z-10">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">2</div>
                            <h4 className="font-bold text-slate-800 mb-2">Approve Booking</h4>
                            <p className="text-sm text-slate-500">Confirming instantly sends a voucher to the corporate employee.</p>
                        </div>
                        <div className="relative p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center z-10">
                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">3</div>
                            <h4 className="font-bold text-slate-800 mb-2">Payment Settlement</h4>
                            <p className="text-sm text-slate-500">Payment is processed according to your corporate agreement terms.</p>
                        </div>
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-[58%] w-2/3 h-0.5 bg-slate-100 -translate-x-1/2 -z-0"></div>
                    </div>
                </div>

                {/* Section 2: Understanding Statuses */}
                <div className="mt-16 bg-slate-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-bold mb-4">Understanding Statuses</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Keep your dashboard clean by actioning pending requests within 24 hours. Quick responses improve your hotel's ranking.
                            </p>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1 block">Pending</span>
                                <p className="text-sm text-slate-300">Requires your immediate attention. Verify room availability.</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1 block">Confirmed</span>
                                <p className="text-sm text-slate-300">Booking is locked. Guest has received their confirmation voucher.</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <span className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1 block">Rejected</span>
                                <p className="text-sm text-slate-300">Declined by hotel. Reason provided to corporate admin.</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 block">Cancelled</span>
                                <p className="text-sm text-slate-300">Cancelled by guest or admin before check-in date.</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>

                {/* Section 3: Value Prop */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-6">🚀</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Organized Bookings Improve Operations</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-sm text-slate-600"><strong>Faster Planning</strong> - Know your corporate occupancy weeks in advance.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-sm text-slate-600"><strong>Better Experience</strong> - Prepare for specific guest requests ahead of time.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <p className="text-sm text-slate-600"><strong>Higher Trust</strong> - Reliable confirmation builds long-term corporate relationships.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 text-center">Manage with Confidence</h4>
                        <p className="text-center text-slate-500 text-sm mb-6">
                            Your dashboard is designed to handle high-volume corporate requests without the clutter.
                        </p>
                        <div className="flex justify-center">
                            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 shadow-sm">
                                Auto-sorting active
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedBooking && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">!</div>
                            <div>
                                <h2 className="text-lg font-bold text-red-900">Decline Booking Request</h2>
                                <p className="text-red-700 text-xs">This action cannot be undone.</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-600 text-sm mb-6">
                                You are about to decline the booking for <strong>{selectedBooking.GuestName}</strong> from <strong>{selectedBooking.corporateName}</strong>.
                            </p>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                    Reason for Rejection *
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm text-slate-700 placeholder-slate-400 bg-slate-50"
                                    rows={3}
                                    placeholder="e.g., No room availability for these dates..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowRejectModal(false); setSelectedBooking(null); setRejectReason(''); }}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition font-bold text-sm shadow-sm"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
