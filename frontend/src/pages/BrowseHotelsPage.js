import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
export const BrowseHotelsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
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
            const params = { page, limit: 12 };
            if (filters.city)
                params.city = filters.city;
            if (filters.state)
                params.state = filters.state;
            if (filters.country)
                params.country = filters.country;
            if (filters.pincode)
                params.pincode = filters.pincode;
            if (filters.minPrice)
                params.minPrice = filters.minPrice;
            if (filters.maxPrice)
                params.maxPrice = filters.maxPrice;
            if (filters.minStars)
                params.minStars = filters.minStars;
            if (filters.guests)
                params.guests = filters.guests;
            if (filters.checkIn)
                params.checkIn = filters.checkIn;
            if (filters.checkOut)
                params.checkOut = filters.checkOut;
            if (filters.sortBy)
                params.sortBy = filters.sortBy;
            // Updated service call to pass all params
            const response = await api.get('/browse/hotels', { params });
            // Actually we need to update the service call but for now use the API response structure
            setHotels(response.data.data || []);
            setCities((response.data.cities || []).map((c) => c.City));
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalResults(response.data.pagination?.total || 0);
        }
        catch (error) {
            console.error('Failed to load hotels:', error);
            setError(error.response?.data?.error || 'Failed to load hotels');
        }
        finally {
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
    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) => (_jsx("span", { className: `text-lg ${i < count ? 'text-yellow-400' : 'text-gray-300'}`, children: "\u2605" }, i)));
    };
    const getEffectivePrice = (hotel) => {
        return hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice
            ? hotel.minCorpPrice
            : hotel.minPrice;
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900", children: [_jsx("div", { className: "bg-white border-b border-slate-200 pb-12 pt-16", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-blue-600 font-bold tracking-wide uppercase text-xs mb-3", children: "Corporate Booking Portal" }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-slate-900 mb-4", children: "Find Corporate-Ready Venues" }), _jsx("p", { className: "text-lg text-slate-500 max-w-2xl", children: "Access our network of vetted hotels offering exclusive negotiated rates, business amenities, and compliant billing." })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-slate-200 p-6 relative z-10 mb-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Location" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: filters.city, onChange: (e) => setFilters({ ...filters, city: e.target.value }), className: "w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-shadow", children: [_jsx("option", { value: "", children: "All Cities" }), cities.map((city) => (_jsx("option", { value: city, children: city }, city)))] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500", children: "\u25BC" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Check-in" }), _jsx("input", { type: "date", min: today, value: filters.checkIn, onChange: (e) => setFilters({ ...filters, checkIn: e.target.value }), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Check-out" }), _jsx("input", { type: "date", min: filters.checkIn || today, value: filters.checkOut, onChange: (e) => setFilters({ ...filters, checkOut: e.target.value }), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("button", { onClick: handleSearch, className: "w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2", children: [_jsx("span", { children: "\uD83D\uDD0D" }), " Search Hotels"] }) })] }), _jsx("div", { className: "mt-6 pt-4 border-t border-slate-100 flex justify-center", children: _jsx("button", { onClick: () => setShowFilters(!showFilters), className: "text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-2", children: showFilters ? '▲ Hide Advanced Filters' : '▼ Show Advanced Filters' }) }), showFilters && (_jsxs("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 animate-fadeIn", children: [[
                                        { label: 'Min Price', type: 'number', val: filters.minPrice, key: 'minPrice', placeholder: '₹0' },
                                        { label: 'Max Price', type: 'number', val: filters.maxPrice, key: 'maxPrice', placeholder: '₹10000' }
                                    ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: f.label }), _jsx("input", { type: f.type, placeholder: f.placeholder, value: f.val, onChange: (e) => setFilters({ ...filters, [f.key]: e.target.value }), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" })] }, f.key))), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Star Rating" }), _jsxs("select", { value: filters.minStars, onChange: (e) => setFilters({ ...filters, minStars: e.target.value }), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none", children: [_jsx("option", { value: "", children: "Any Rating" }), _jsx("option", { value: "5", children: "5 Stars Only" }), _jsx("option", { value: "4", children: "4+ Stars" }), _jsx("option", { value: "3", children: "3+ Stars" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Sort By" }), _jsxs("select", { value: filters.sortBy, onChange: (e) => setFilters({ ...filters, sortBy: e.target.value }), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none", children: [_jsx("option", { value: "rating", children: "Top Rated" }), _jsx("option", { value: "price-low", children: "Price: Low to High" }), _jsx("option", { value: "price-high", children: "Price: High to Low" })] })] }), ['State', 'Country', 'Pincode'].map((field) => (_jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: field }), _jsx("input", { type: "text", placeholder: field, value: filters[field.toLowerCase()], onChange: (e) => setFilters({ ...filters, [field.toLowerCase()]: e.target.value }), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" })] }, field))), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2", children: "Guests" }), _jsxs("select", { value: filters.guests, onChange: (e) => setFilters({ ...filters, guests: e.target.value }), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none", children: [_jsx("option", { value: "", children: "Any" }), _jsx("option", { value: "1", children: "1 Guest" }), _jsx("option", { value: "2", children: "2 Guests" }), _jsx("option", { value: "3", children: "3 Guests" }), _jsx("option", { value: "4", children: "4+ Guests" })] })] })] }))] }), _jsxs("div", { className: "pb-16", children: [error && (_jsxs("div", { className: "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-8", children: [_jsx("p", { className: "font-bold", children: "Error Loading Hotels" }), _jsx("p", { children: error })] })), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900", children: loading ? 'Searching Venues...' : `${totalResults} Venues Found` }), filters.city && (_jsxs("p", { className: "text-slate-500 text-sm mt-1", children: ["Showing results in ", _jsx("span", { className: "font-semibold text-slate-800", children: filters.city })] }))] }), (filters.city || filters.minPrice || filters.maxPrice || filters.minStars || filters.guests) && (_jsxs("button", { onClick: clearFilters, className: "text-slate-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors", children: [_jsx("span", { children: "\u2715" }), " Clear Filters"] }))] }), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [1, 2, 3, 4, 5, 6].map((i) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px] animate-pulse", children: [_jsx("div", { className: "h-48 bg-slate-100" }), _jsxs("div", { className: "p-6 space-y-3", children: [_jsx("div", { className: "h-6 bg-slate-100 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-slate-100 rounded w-1/2" }), _jsx("div", { className: "h-10 bg-slate-100 rounded-lg mt-4" })] })] }, i))) })) : hotels.length === 0 ? (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6", children: "\uD83C\uDFE2" }), _jsx("h2", { className: "text-xl font-bold text-slate-900 mb-2", children: "No Venues Found" }), _jsx("p", { className: "text-slate-500 mb-6", children: "We couldn't find any hotels matching your criteria completely." }), _jsx("button", { onClick: clearFilters, className: "bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 font-medium transition-colors", children: "Reset Search" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: hotels.map((hotel) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full", onClick: () => navigate(`/corporate/hotels/${hotel.Id}${filters.checkIn ? `?checkIn=${filters.checkIn}&checkOut=${filters.checkOut}` : ''}`), children: [_jsxs("div", { className: "h-48 bg-slate-100 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-slate-300", children: _jsx("span", { className: "text-4xl", children: "\uD83C\uDFE8" }) }), _jsx("div", { className: "absolute top-4 left-4 z-20 flex flex-col gap-2", children: hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice && (_jsx("span", { className: "bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm", children: "Corporate Rate" })) }), _jsxs("div", { className: "absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1", children: [_jsx("span", { className: "text-yellow-400 text-xs", children: "\u2605" }), _jsx("span", { className: "text-slate-700 text-xs font-bold", children: hotel.StarCategory })] })] }), _jsxs("div", { className: "p-6 flex-1 flex flex-col", children: [_jsx("div", { className: "flex justify-between items-start mb-2", children: _jsx("h3", { className: "text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1", children: hotel.HotelName }) }), _jsxs("p", { className: "text-slate-500 text-sm mb-4 flex items-center gap-1.5", children: [_jsx("span", { children: "\uD83D\uDCCD" }), " ", hotel.City, _jsx("span", { className: "text-slate-300", children: "\u2022" }), _jsx("span", { className: "truncate max-w-[150px]", children: hotel.Address })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [_jsxs("span", { className: "text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200", children: [hotel.roomTypeCount, " Room Types"] }), hotel.maxCapacity && (_jsxs("span", { className: "text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200", children: ["Max ", hotel.maxCapacity, " Guests"] }))] }), _jsxs("div", { className: "mt-auto pt-4 border-t border-slate-100 flex items-end justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 font-medium uppercase tracking-wide", children: "Starting from" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [hotel.minCorpPrice && hotel.minCorpPrice < hotel.minPrice && (_jsxs("span", { className: "text-slate-400 line-through text-sm", children: ["\u20B9", hotel.minPrice] })), _jsxs("span", { className: "text-2xl font-bold text-slate-900", children: ["\u20B9", getEffectivePrice(hotel)] }), _jsx("span", { className: "text-slate-500 text-xs", children: "/night" })] })] }), _jsx("button", { className: "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors", children: "View Details" })] })] })] }, hotel.Id))) }), totalPages > 1 && (_jsxs("div", { className: "flex justify-center items-center gap-2 mt-12 bg-white inline-flex mx-auto p-2 rounded-xl border border-slate-100 shadow-sm left-1/2 relative -translate-x-1/2", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors", children: "Previous" }), _jsx("div", { className: "h-4 w-px bg-slate-200 mx-2" }), _jsxs("span", { className: "text-sm font-bold text-slate-900", children: ["Page ", page, " of ", totalPages] }), _jsx("div", { className: "h-4 w-px bg-slate-200 mx-2" }), _jsx("button", { onClick: () => setPage(Math.min(totalPages, page + 1)), disabled: page === totalPages, className: "px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors", children: "Next" })] }))] }))] }), _jsxs("div", { className: "border-t border-slate-200 pt-16 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-6 flex items-center gap-3", children: [_jsx("span", { className: "w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm", children: "\uD83D\uDCA1" }), "Choosing the Right Venue"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("span", { className: "text-slate-300 text-xl font-serif italic", children: "1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Location & Accessibility" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Ensure the hotel is close to your office or event venue to minimize commute time for employees." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("span", { className: "text-slate-300 text-xl font-serif italic", children: "2" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Corporate Amenities" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Look for high-speed Wi-Fi, meeting rooms, and work desks which are standard in our verified listings." })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("span", { className: "text-slate-300 text-xl font-serif italic", children: "3" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 text-sm", children: "Flexible Cancellation" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Business plans change. Check for flexible booking policies highlighted on the property page." })] })] })] })] }), _jsxs("div", { className: "bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-6", children: "\uD83D\uDEE1\uFE0F" }), _jsx("h3", { className: "text-xl font-bold mb-2", children: "Verified for Corporate Compliance" }), _jsx("p", { className: "text-slate-400 text-sm mb-6 leading-relaxed", children: "Every hotel in our directory goes through a strict verification process to ensure they meet the safety, quality, and billing standards required by modern enterprises." }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("span", { className: "bg-white/10 px-3 py-1 rounded-full text-xs font-medium", children: "GST Compliant" }), _jsx("span", { className: "bg-white/10 px-3 py-1 rounded-full text-xs font-medium", children: "Hygiene Audited" }), _jsx("span", { className: "bg-white/10 px-3 py-1 rounded-full text-xs font-medium", children: "24/7 Support" })] })] }), _jsx("div", { className: "absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl" })] })] })] })] }));
};
