import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { useNavigate } from 'react-router-dom';
export const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadBookings();
    }, [isAuthenticated, navigate]);
    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getBookings(filter || undefined);
            setBookings(response.data);
        }
        catch (error) {
            console.error('Failed to load bookings:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancel = async (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(id);
                loadBookings();
            }
            catch (error) {
                console.error('Failed to cancel booking:', error);
            }
        }
    };
    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'cancelled':
                return 'bg-slate-100 text-slate-500 border border-slate-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            default:
                return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };
    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return '●'; // Dot for clean look
            case 'pending':
                return '○';
            case 'cancelled':
                return '×';
            case 'completed':
                return '✓';
            default:
                return '○';
        }
    };
    // Frontend Logic Validation: Strict Filter
    const filteredBookings = bookings.filter(booking => {
        if (filter === '')
            return true; // Show all
        return booking.BookingStatus.toLowerCase() === filter.toLowerCase();
    });
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-3", children: "Corporate Travel Management" }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-slate-900 mb-4", children: "Corporate Bookings Board" }), _jsx("p", { className: "text-lg text-slate-500 max-w-2xl", children: "Track, manage, and audit all your corporate hotel reservations in one centralized dashboard." })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("div", { className: "mb-10 flex flex-wrap gap-2 border-b border-slate-200 pb-4", children: ['', 'confirmed', 'pending', 'cancelled', 'completed'].map((status) => (_jsxs("button", { onClick: () => { setFilter(status); loadBookings(); }, className: `px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filter === status
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'}`, children: [status === '' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1), filter === status && _jsx("span", { className: "text-xs bg-white/20 px-1.5 rounded-full", children: "\u2713" })] }, status))) }), loading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 h-40 animate-pulse", children: [_jsx("div", { className: "h-4 bg-slate-100 rounded w-1/4 mb-4" }), _jsx("div", { className: "h-4 bg-slate-100 rounded w-1/2 mb-4" })] }, i))) })) : filteredBookings.length === 0 ? (_jsxs("div", { className: "text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm border-dashed", children: [_jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6", children: "\uD83D\uDCC5" }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: filter ? `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings` : 'No Bookings Found' }), _jsx("p", { className: "text-slate-500 mb-8 max-w-md mx-auto", children: filter
                                    ? `You don't have any bookings with ${filter} status.`
                                    : "You haven't made any bookings yet." }), user?.identityType !== 'Hotel' && (_jsx("button", { onClick: () => navigate('/corporate/find-hotels'), className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm hover:shadow-md", children: "Find a Hotel" }))] })) : (_jsx("div", { className: "space-y-4", children: filteredBookings.map((booking) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group", children: [_jsxs("div", { className: "flex-grow", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-4", children: [_jsxs("span", { className: `px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 w-fit ${getStatusBadgeColor(booking.BookingStatus)}`, children: [getStatusIcon(booking.BookingStatus), booking.BookingStatus] }), _jsxs("span", { className: "text-xs text-slate-400 font-mono tracking-wider", children: ["#", booking.BookingNumber] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors", children: booking.hotelName }), _jsxs("p", { className: "text-sm text-slate-500 mt-1 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDECF\uFE0F" }), " ", booking.roomTypeName] })] }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] uppercase text-slate-400 font-bold mb-1", children: "Check In" }), _jsx("p", { className: "text-sm font-bold text-slate-700", children: new Date(booking.CheckInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) })] }), _jsx("div", { className: "h-8 w-px bg-slate-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] uppercase text-slate-400 font-bold mb-1", children: "Check Out" }), _jsx("p", { className: "text-sm font-bold text-slate-700", children: new Date(booking.CheckOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) })] })] })] })] }), _jsxs("div", { className: "flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-2 min-w-[140px] border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end", children: [_jsxs("div", { className: "text-left md:text-right", children: [_jsx("p", { className: "text-xs text-slate-400 font-bold uppercase mb-1", children: "Total" }), _jsxs("p", { className: "text-xl font-bold text-slate-900", children: ["\u20B9", booking.TotalPrice.toLocaleString()] })] }), booking.BookingStatus.toLowerCase() === 'confirmed' && (_jsx("button", { onClick: () => handleCancel(booking.Id), className: "text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-50 transition-colors border border-transparent hover:border-red-100", children: "Cancel Booking" }))] })] }, booking.Id))) })), _jsxs("div", { className: "border-t border-slate-200 mt-16 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-6 flex items-center gap-3", children: [_jsx("span", { className: "w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm", children: "\uD83D\uDC54" }), "Manage Your Corporate Bookings Easily"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400", children: "\uD83D\uDC40" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Real-time Visibility" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "View status updates instantly as requests are confirmed by our hotel partners." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 text-slate-400", children: "\uD83D\uDCDD" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Easy Modifications" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Need to change plans? Cancel or modify bookings directly from your dashboard with one click." })] })] })] })] }), _jsxs("div", { className: "bg-slate-900/5 border border-slate-200 p-8 rounded-2xl relative overflow-hidden", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 mb-4", children: "Centralized Booking Experience" }), _jsx("p", { className: "text-slate-600 text-sm mb-6 leading-relaxed", children: "CorpHotel streamlines your travel auditing by keeping all reservation data, invoices, and compliance checks in one secure, accessible location." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("span", { className: "bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm", children: "Secure" }), _jsx("span", { className: "bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm", children: "Auditable" }), _jsx("span", { className: "bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm", children: "Compliant" })] })] })] })] })] }));
};
