import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { browseHotelService } from '../services';
import api from '../services/api';

interface Hotel {
    Id: number;
    HotelName: string;
    City: string;
    State: string;
    Country: string;
    Pincode: string;
    Address: string;
    StarCategory: number;
    ContactEmail: string;
    Description: string;
    roomTypeCount: number;
    minPrice: number;
    maxPrice: number;
    minCorpPrice: number | null;
    maxCapacity: number;
    roomTypeNames: string;
}

interface Filters {
    city: string;
    state: string;
    country: string;
    pincode: string;
    minPrice: string;
    maxPrice: string;
    minStars: string;
    guests: string;
    checkIn: string;
    checkOut: string;
    sortBy: string;
}

export const BrowseHotelsPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        city: '',
        state: '',
        country: '',
        pincode: '',
        minPrice: '',
        maxPrice: '',
        minStars: '',
        guests: '',
        checkIn: '',
        checkOut: '',
        sortBy: 'rating'
    });

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.identityType !== 'Corporate') {
            navigate('/');
            return;
        }
    }, [isAuthenticated, user, navigate]);

    const loadHotels = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params: any = { page, limit: 12 };
            if (filters.city) params.city = filters.city;
            if (filters.state) params.state = filters.state;
            if (filters.country) params.country = filters.country;
            if (filters.pincode) params.pincode = filters.pincode;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.minStars) params.minStars = filters.minStars;
            if (filters.guests) params.guests = filters.guests;
            if (filters.checkIn) params.checkIn = filters.checkIn;
            if (filters.checkOut) params.checkOut = filters.checkOut;
            if (filters.sortBy) params.sortBy = filters.sortBy;

            // Updated service call to pass all params
            const response = await api.get('/browse/hotels', { params });

            // Actually we need to update the service call but for now use the API response structure
            setHotels(response.data.data || []);
            setCities((response.data.cities || []).map((c: any) => c.City));
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalResults(response.data.pagination?.total || 0);
        } catch (error: any) {
            console.error('Failed to load hotels:', error);
            setError(error.response?.data?.error || 'Failed to load hotels');
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        if (isAuthenticated && user?.identityType === 'Corporate') {
            loadHotels();
        }
    }, [loadHotels, isAuthenticated, user]);

    const handleSearch = () => {
        setPage(1);
        loadHotels();
    };

    const clearFilters = () => {
        setFilters({
            city: '',
            state: '',
            country: '',
            pincode: '',
            minPrice: '',
            maxPrice: '',
            minStars: '',
            guests: '',
            checkIn: '',
            checkOut: '',
            sortBy: 'rating'
        });
        setPage(1);
    };

    const renderStars = (count: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ));
    };

    const getEffectivePrice = (hotel: Hotel) => {
        return hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice
            ? hotel.minCorpPrice
            : hotel.minPrice;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Page Header (UI Update) */}
            <div className="bg-white border-b border-slate-200 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Corporate Booking Portal</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Find Corporate-Ready Venues
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Access our network of vetted hotels offering exclusive negotiated rates, business amenities, and compliant billing.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Search & Filters Card */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 relative z-10 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Location</label>
                            <div className="relative">
                                <select
                                    value={filters.city}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-shadow"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">▼</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Check-in</label>
                            <input
                                type="date"
                                min={today}
                                value={filters.checkIn}
                                onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Check-out</label>
                            <input
                                type="date"
                                min={filters.checkIn || today}
                                value={filters.checkOut}
                                onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>🔍</span> Search Hotels
                            </button>
                        </div>
                    </div>

                    {/* Toggle Advanced Filters */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            {showFilters ? '▲ Hide Advanced Filters' : '▼ Show Advanced Filters'}
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 animate-fadeIn">
                            {[
                                { label: 'Min Price', type: 'number', val: filters.minPrice, key: 'minPrice', placeholder: '₹0' },
                                { label: 'Max Price', type: 'number', val: filters.maxPrice, key: 'maxPrice', placeholder: '₹10000' }
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{f.label}</label>
                                    <input
                                        type={f.type}
                                        placeholder={f.placeholder}
                                        value={f.val}
                                        onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Star Rating</label>
                                <select
                                    value={filters.minStars}
                                    onChange={(e) => setFilters({ ...filters, minStars: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="5">5 Stars Only</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="rating">Top Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Additional Text Inputs */}
                            {['State', 'Country', 'Pincode'].map((field) => (
                                <div key={field}>
                                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{field}</label>
                                    <input
                                        type="text"
                                        placeholder={field}
                                        value={(filters as any)[field.toLowerCase()]}
                                        onChange={(e) => setFilters({ ...filters, [field.toLowerCase()]: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Guests</label>
                                <select
                                    value={filters.guests}
                                    onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Any</option>
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3 Guests</option>
                                    <option value="4">4+ Guests</option>
                                </select>
                            </div>

                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="pb-16">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-8">
                            <p className="font-bold">Error Loading Hotels</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {loading ? 'Searching Venues...' : `${totalResults} Venues Found`}
                            </h2>
                            {filters.city && (
                                <p className="text-slate-500 text-sm mt-1">Showing results in <span className="font-semibold text-slate-800">{filters.city}</span></p>
                            )}
                        </div>
                        {(filters.city || filters.minPrice || filters.maxPrice || filters.minStars || filters.guests) && (
                            <button
                                onClick={clearFilters}
                                className="text-slate-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <span>✕</span> Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Hotel Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px] animate-pulse">
                                    <div className="h-48 bg-slate-100"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg mt-4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hotels.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🏢</div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">No Venues Found</h2>
                            <p className="text-slate-500 mb-6">We couldn't find any hotels matching your criteria completely.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Reset Search
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {hotels.map((hotel) => (
                                    <div
                                        key={hotel.Id}
                                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
                                        onClick={() => navigate(`/corporate/hotels/${hotel.Id}${filters.checkIn ? `?checkIn=${filters.checkIn}&checkOut=${filters.checkOut}` : ''}`)}
                                    >
                                        {/* Image Area */}
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            {/* Placeholder Gradient if no image (UI Only) - In real app insert image tag here */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                <span className="text-4xl">🏨</span>
                                            </div>

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                                {hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice && (
                                                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                        Corporate Rate
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                                <span className="text-yellow-400 text-xs">★</span>
                                                <span className="text-slate-700 text-xs font-bold">{hotel.StarCategory}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {hotel.HotelName}
                                                </h3>
                                            </div>

                                            <p className="text-slate-500 text-sm mb-4 flex items-center gap-1.5">
                                                <span>📍</span> {hotel.City}
                                                <span className="text-slate-300">•</span>
                                                <span className="truncate max-w-[150px]">{hotel.Address}</span>
                                            </p>

                                            {/* Specs */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                    {hotel.roomTypeCount} Room Types
                                                </span>
                                                {hotel.maxCapacity && (
                                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                        Max {hotel.maxCapacity} Guests
                                                    </span>
                                                )}
                                            </div>

                                            {/* Footer / Price */}
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Starting from</p>
                                                    <div className="flex items-baseline gap-2">
                                                        {hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice && (
                                                            <span className="text-slate-400 line-through text-sm">₹{hotel.minPrice}</span>
                                                        )}
                                                        <span className="text-2xl font-bold text-slate-900">
                                                            ₹{getEffectivePrice(hotel)}
                                                        </span>
                                                        <span className="text-slate-500 text-xs">/night</span>
                                                    </div>
                                                </div>
                                                <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination (Refined UI) */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 bg-white inline-flex mx-auto p-2 rounded-xl border border-slate-100 shadow-sm left-1/2 relative -translate-x-1/2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                                    <span className="text-sm font-bold text-slate-900">
                                        Page {page} of {totalPages}
                                    </span>
                                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* New Guidance Content Sections */}
                <div className="border-t border-slate-200 pt-16 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Section 1: How to Choose */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">💡</span>
                            Choosing the Right Venue
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="text-slate-300 text-xl font-serif italic">1</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Location & Accessibility</h4>
                                    <p className="text-slate-500 text-sm mt-1">Ensure the hotel is close to your office or event venue to minimize commute time for employees.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 text-xl font-serif italic">2</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Corporate Amenities</h4>
                                    <p className="text-slate-500 text-sm mt-1">Look for high-speed Wi-Fi, meeting rooms, and work desks which are standard in our verified listings.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 text-xl font-serif italic">3</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Flexible Cancellation</h4>
                                    <p className="text-slate-500 text-sm mt-1">Business plans change. Check for flexible booking policies highlighted on the property page.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Verified Standards */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-6">🛡️</div>
                            <h3 className="text-xl font-bold mb-2">Verified for Corporate Compliance</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Every hotel in our directory goes through a strict verification process to ensure they meet the safety, quality, and billing standards required by modern enterprises.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">GST Compliant</span>
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">Hygiene Audited</span>
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">24/7 Support</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};
