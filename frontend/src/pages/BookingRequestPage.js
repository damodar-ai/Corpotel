import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingService, browseHotelService } from '../services';
export const BookingRequestPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const hotelId = searchParams.get('hotelId');
    const roomTypeId = searchParams.get('roomTypeId');
    const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
    const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [roomTypeName, setRoomTypeName] = useState('');
    const [price, setPrice] = useState(0);
    const [formData, setFormData] = useState({
        guestName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        guestEmail: user?.email || '',
        guestPhone: user?.phone || '',
        roomCount: 1,
        specialRequests: ''
    });
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }
        if (!hotelId || !roomTypeId) {
            setError('Missing required booking information');
            return;
        }
        loadDetails();
    }, [isAuthenticated, hotelId, roomTypeId]);
    const loadDetails = async () => {
        try {
            setLoading(true);
            const hotelRes = await browseHotelService.getHotelDetails(Number(hotelId));
            // Access nested hotel object and use PascalCase
            setHotelName(hotelRes.data.hotel.HotelName);
            // Find room type from the hotel details response instead of separate API call
            // because api/room-types/:id is restricted to Hotel users only.
            const targetRoom = hotelRes.data.roomTypes.find((r) => r.Id === Number(roomTypeId));
            if (targetRoom) {
                setRoomTypeName(targetRoom.Name);
                setPrice(targetRoom.CorporatePrice || targetRoom.BasePrice);
            }
            else {
                throw new Error('Room type not found');
            }
        }
        catch (err) {
            console.error('Failed to load booking details:', err);
            setError('Failed to load booking details');
        }
        finally {
            setLoading(false);
        }
    };
    const calculateTotal = () => {
        if (!checkIn || !checkOut)
            return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const numNights = nights > 0 ? nights : 1;
        return price * numNights * (formData.roomCount || 1);
    };
    // Add terms state
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            setError('Please agree to the booking terms and conditions');
            return;
        }
        setError('');
        setLoading(true);
        try {
            if (!checkIn || !checkOut) {
                setError('Please select check-in and check-out dates');
                setLoading(false);
                return;
            }
            await bookingService.createBooking({
                hotelDetailsId: Number(hotelId),
                roomTypeId: Number(roomTypeId),
                checkInDate: checkIn,
                checkOutDate: checkOut,
                ...formData
            });
            // Redirect to bookings list with success message
            navigate('/bookings');
        }
        catch (err) {
            console.error('Booking failed:', err);
            setError(err.response?.data?.error || 'Failed to submit booking request');
        }
        finally {
            setLoading(false);
        }
    };
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50", children: _jsxs("div", { className: "bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-slate-200", children: [_jsx("div", { className: "w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsx("p", { className: "text-slate-800 font-medium mb-6", children: error }), _jsx("button", { onClick: () => setError(''), className: "text-blue-600 hover:text-blue-800 font-bold text-sm", children: "Try Again" }), _jsx("span", { className: "mx-2 text-slate-300", children: "|" }), _jsx("button", { onClick: () => navigate(-1), className: "text-slate-500 hover:text-slate-800 font-bold text-sm", children: "Go Back" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900 pb-24", children: [_jsx("div", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate(-1), className: "group flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-slate-500 hover:text-slate-800", children: _jsx("svg", { className: "w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[10px] uppercase tracking-widest text-slate-400 font-bold", children: "New Request" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-lg font-bold text-slate-900", children: hotelName || 'Loading Hotel...' }), _jsx("span", { className: "h-4 w-px bg-slate-300 mx-1" }), _jsx("span", { className: "text-sm font-medium text-slate-600", children: roomTypeName })] })] })] }), _jsxs("div", { className: "hidden md:flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs font-bold text-blue-700 uppercase tracking-wide", children: "Corporate Rate Applied" })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10", children: [_jsxs("div", { className: "lg:col-span-8 space-y-10", children: [_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm", children: "1" }), _jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Stay Duration" })] }), _jsxs("div", { className: "bg-white p-1 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100", children: [_jsxs("div", { className: "p-5 hover:bg-slate-50 transition-colors group", children: [_jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors", children: "Check-in" }), _jsx("input", { type: "date", required: true, value: checkIn, onChange: (e) => setCheckIn(e.target.value), min: new Date().toISOString().split('T')[0], className: "w-full bg-transparent border-none p-0 text-lg font-medium text-slate-900 focus:ring-0 cursor-pointer" })] }), _jsxs("div", { className: "p-5 hover:bg-slate-50 transition-colors group", children: [_jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors", children: "Check-out" }), _jsx("input", { type: "date", required: true, value: checkOut, onChange: (e) => setCheckOut(e.target.value), min: checkIn || new Date().toISOString().split('T')[0], className: "w-full bg-transparent border-none p-0 text-lg font-medium text-slate-900 focus:ring-0 cursor-pointer" })] })] })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm", children: "2" }), _jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Guest Information" })] }), _jsx("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2", children: [_jsxs("div", { className: "p-6 border-b md:border-b-0 md:border-r border-slate-100", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Guest Name" }), _jsx("input", { type: "text", required: true, value: formData.guestName, onChange: (e) => setFormData({ ...formData, guestName: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", placeholder: "Official name on ID" })] }), _jsxs("div", { className: "p-6 border-b md:border-b-0 border-slate-100", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Corporate Email" }), _jsx("input", { type: "email", required: true, value: formData.guestEmail, onChange: (e) => setFormData({ ...formData, guestEmail: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", placeholder: "employee@company.com" })] }), _jsxs("div", { className: "p-6 border-b md:border-b-0 md:border-r border-slate-100", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Contact Number" }), _jsx("input", { type: "tel", value: formData.guestPhone, onChange: (e) => setFormData({ ...formData, guestPhone: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", placeholder: "+1 (555) 000-0000" })] }), _jsxs("div", { className: "p-6", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Room Quantity" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { type: "button", onClick: () => setFormData(prev => ({ ...prev, roomCount: Math.max(1, prev.roomCount - 1) })), className: "w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500", children: "-" }), _jsx("input", { type: "number", min: "1", required: true, value: formData.roomCount, onChange: (e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 1 }), className: "w-16 text-center font-bold text-lg text-slate-900 border-none bg-transparent p-0 focus:ring-0" }), _jsx("button", { type: "button", onClick: () => setFormData(prev => ({ ...prev, roomCount: prev.roomCount + 1 })), className: "w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500", children: "+" })] })] })] }) })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm", children: "3" }), _jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Preferences" })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3", children: "Special Requests & Notes" }), _jsx("textarea", { value: formData.specialRequests, onChange: (e) => setFormData({ ...formData, specialRequests: e.target.value }), className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-y placeholder-slate-400 text-sm leading-relaxed", placeholder: "Please specify any dietary restrictions, accessibility needs, or arrival time details..." }), _jsxs("div", { className: "flex gap-4 mt-4 text-xs text-slate-500", children: [_jsxs("span", { className: "flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100", children: [_jsx("svg", { className: "w-3.5 h-3.5 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }), "High Priority"] }), _jsxs("span", { className: "flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100", children: [_jsx("svg", { className: "w-3.5 h-3.5 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }), "Confidential"] })] })] })] })] }), _jsx("div", { className: "lg:col-span-4 pl-0 lg:pl-6", children: _jsx("div", { className: "sticky top-28", children: _jsxs("div", { className: "bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center", children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Estimate" }), _jsx("span", { className: "text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100", children: "Draft" })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-500", children: "Property" }), _jsx("p", { className: "font-bold text-slate-900 leading-tight", children: hotelName })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase", children: "Rate Class" }), _jsx("p", { className: "font-semibold text-slate-800 text-sm mt-0.5", children: roomTypeName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase", children: "Nights" }), _jsx("p", { className: "font-semibold text-slate-800 text-sm mt-0.5", children: checkIn && checkOut ?
                                                                        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
                                                                        : '-' })] })] }), _jsx("div", { className: "border-t border-dashed border-slate-200 my-2" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Base Rate" }), _jsxs("span", { className: "font-medium text-slate-900", children: ["\u20B9", price.toLocaleString(), " ", _jsx("span", { className: "text-slate-400 font-normal", children: "/ night" })] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Rooms" }), _jsxs("span", { className: "font-medium text-slate-900", children: ["x ", formData.roomCount] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Taxes & Fees" }), _jsx("span", { className: "font-medium text-slate-900", children: "Included" })] })] }), _jsxs("div", { className: "bg-slate-900 rounded-lg p-4 text-white flex justify-between items-center shadow-lg", children: [_jsx("span", { className: "text-sm font-medium opacity-80", children: "Total Estimate" }), _jsxs("span", { className: "text-xl font-bold tracking-tight", children: ["\u20B9", calculateTotal().toLocaleString()] })] }), _jsx("div", { className: "pt-2", children: _jsxs("label", { className: "flex items-start gap-3 cursor-pointer group", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx("input", { type: "checkbox", className: "peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all text-blue-600 focus:ring-1 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600", checked: agreedToTerms, onChange: (e) => setAgreedToTerms(e.target.checked) }), _jsx("svg", { className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "3", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }) })] }), _jsxs("span", { className: "text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors", children: ["I agree to the ", _jsx("span", { className: "underline decoration-slate-300 underline-offset-2", children: "Corporate Booking Terms" }), " and cancellation policy."] })] }) }), _jsx("button", { onClick: handleSubmit, disabled: loading || !agreedToTerms, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2", children: loading ? 'Processing...' : 'Confirm Request' })] }), _jsx("div", { className: "bg-slate-50 p-3 text-center border-t border-slate-100", children: _jsxs("p", { className: "text-[10px] text-slate-400 flex items-center justify-center gap-1", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }), "Encrypted 256-bit Security"] }) })] }) }) })] }) })] }));
};
