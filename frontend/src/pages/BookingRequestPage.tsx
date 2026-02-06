import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingService, browseHotelService, roomTypeService } from '../services';

export const BookingRequestPage: React.FC = () => {
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
            const targetRoom = hotelRes.data.roomTypes.find((r: any) => r.Id === Number(roomTypeId));

            if (targetRoom) {
                setRoomTypeName(targetRoom.Name);
                setPrice(targetRoom.CorporatePrice || targetRoom.BasePrice);
            } else {
                throw new Error('Room type not found');
            }

        } catch (err) {
            console.error('Failed to load booking details:', err);
            setError('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const numNights = nights > 0 ? nights : 1;
        return price * numNights * (formData.roomCount || 1);
    };

    // Add terms state
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (err: any) {
            console.error('Booking failed:', err);
            setError(err.response?.data?.error || 'Failed to submit booking request');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-slate-200">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <p className="text-slate-800 font-medium mb-6">{error}</p>
                    <button onClick={() => setError('')} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Try Again</button>
                    <span className="mx-2 text-slate-300">|</span>
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 font-bold text-sm">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-slate-500 hover:text-slate-800"
                        >
                            <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">New Request</span>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">{hotelName || 'Loading Hotel...'}</h1>
                                <span className="h-4 w-px bg-slate-300 mx-1"></span>
                                <span className="text-sm font-medium text-slate-600">{roomTypeName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Corporate Rate Applied</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Modern Form */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Section 1: Dates */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                                <h3 className="text-lg font-bold text-slate-900">Stay Duration</h3>
                            </div>
                            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="p-5 hover:bg-slate-50 transition-colors group">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors">Check-in</label>
                                    <input
                                        type="date"
                                        required
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-transparent border-none p-0 text-lg font-medium text-slate-900 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                                <div className="p-5 hover:bg-slate-50 transition-colors group">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors">Check-out</label>
                                    <input
                                        type="date"
                                        required
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-transparent border-none p-0 text-lg font-medium text-slate-900 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Guest Details */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                                <h3 className="text-lg font-bold text-slate-900">Guest Information</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guest Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.guestName}
                                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            placeholder="Official name on ID"
                                        />
                                    </div>
                                    <div className="p-6 border-b md:border-b-0 border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.guestEmail}
                                            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            placeholder="employee@company.com"
                                        />
                                    </div>
                                    <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={formData.guestPhone}
                                            onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Room Quantity</label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, roomCount: Math.max(1, prev.roomCount - 1) }))}
                                                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={formData.roomCount}
                                                onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 1 })}
                                                className="w-16 text-center font-bold text-lg text-slate-900 border-none bg-transparent p-0 focus:ring-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, roomCount: prev.roomCount + 1 }))}
                                                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Preferences */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">3</div>
                                <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Special Requests & Notes</label>
                                <textarea
                                    value={formData.specialRequests}
                                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-y placeholder-slate-400 text-sm leading-relaxed"
                                    placeholder="Please specify any dietary restrictions, accessibility needs, or arrival time details..."
                                />
                                <div className="flex gap-4 mt-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        High Priority
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Confidential
                                    </span>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Invoice / Summary */}
                    <div className="lg:col-span-4 pl-0 lg:pl-6">
                        <div className="sticky top-28">
                            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimate</span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100">Draft</span>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Property</p>
                                        <p className="font-bold text-slate-900 leading-tight">{hotelName}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Rate Class</p>
                                            <p className="font-semibold text-slate-800 text-sm mt-0.5">{roomTypeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Nights</p>
                                            <p className="font-semibold text-slate-800 text-sm mt-0.5">
                                                {checkIn && checkOut ?
                                                    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-slate-200 my-2"></div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Base Rate</span>
                                            <span className="font-medium text-slate-900">₹{price.toLocaleString()} <span className="text-slate-400 font-normal">/ night</span></span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Rooms</span>
                                            <span className="font-medium text-slate-900">x {formData.roomCount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Taxes & Fees</span>
                                            <span className="font-medium text-slate-900">Included</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-lg p-4 text-white flex justify-between items-center shadow-lg">
                                        <span className="text-sm font-medium opacity-80">Total Estimate</span>
                                        <span className="text-xl font-bold tracking-tight">₹{calculateTotal().toLocaleString()}</span>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all text-blue-600 focus:ring-1 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600"
                                                    checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                />
                                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                                                I agree to the <span className="underline decoration-slate-300 underline-offset-2">Corporate Booking Terms</span> and cancellation policy.
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !agreedToTerms}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Request'}
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        Encrypted 256-bit Security
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
