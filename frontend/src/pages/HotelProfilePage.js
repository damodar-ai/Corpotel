import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { CountryCodeSelect } from '../components/CountryCodeSelect';
export const HotelProfilePage = () => {
    const { updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hotelName: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        address: '',
        contactCountryCode: '+1',
        contactNumber: '',
        contactEmail: '',
        supervisorName: '',
        supervisorEmail: '',
        supervisorCountryCode: '+1',
        supervisorContact: '',
        starCategory: 3
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleCountryCodeChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const [isViewMode, setIsViewMode] = useState(false);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getHotelProfile();
                if (response.data) {
                    const { HotelName, City, Address, ContactNumber, ContactEmail, SupervisorName, SupervisorEmail, SupervisorContact, StarCategory } = response.data;
                    // Parse phone numbers
                    const parsePhone = (fullNumber) => {
                        if (!fullNumber)
                            return { code: '+1', number: '' };
                        const codes = ['+91', '+1', '+44', '+971'];
                        for (const code of codes) {
                            if (fullNumber.startsWith(code)) {
                                return { code, number: fullNumber.slice(code.length) };
                            }
                        }
                        return { code: '+1', number: fullNumber };
                    };
                    const contactPhone = parsePhone(ContactNumber || '');
                    const supervisorPhone = parsePhone(SupervisorContact || '');
                    setFormData({
                        hotelName: HotelName || '',
                        city: City || '',
                        state: response.data.State || '',
                        country: response.data.Country || '',
                        pincode: response.data.Pincode || '',
                        address: Address || '',
                        contactCountryCode: contactPhone.code,
                        contactNumber: contactPhone.number,
                        contactEmail: ContactEmail || '',
                        supervisorName: SupervisorName || '',
                        supervisorEmail: SupervisorEmail || '',
                        supervisorCountryCode: supervisorPhone.code,
                        supervisorContact: supervisorPhone.number,
                        starCategory: StarCategory || 3
                    });
                    setIsViewMode(true);
                }
            }
            catch (error) {
                // Ignore 404, valid for new profiles
                console.log('No existing profile found or error fetching:', error);
            }
        };
        fetchProfile();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                contactNumber: formData.contactCountryCode + formData.contactNumber,
                supervisorContact: formData.supervisorCountryCode + formData.supervisorContact
            };
            const response = await userService.createHotelProfile(payload);
            // Save the new token with Hotel identityType
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            updateUser({ isProfileCompleted: true, identityType: 'Hotel' });
            alert('Profile saved successfully!');
            navigate('/hotel/dashboard');
        }
        catch (error) {
            console.error('Failed to create/update profile:', error);
            setError(error.response?.data?.error || 'Failed to save profile. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const [error, setError] = useState('');
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900 pb-24", children: [_jsx("div", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Hotel Partner Profile" }), _jsx("p", { className: "text-sm text-slate-500", children: "Manage your property details and visibility" })] }), _jsx("div", { children: _jsxs("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${isViewMode ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full mr-2 ${isViewMode ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}` }), isViewMode ? 'Profile Active' : 'Setup Required'] }) })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [_jsxs("div", { className: "lg:col-span-2 space-y-8", children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), error] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Property Details" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Hotel Name" }), _jsx("input", { type: "text", name: "hotelName", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.hotelName, onChange: handleChange, placeholder: "e.g. Grand Plaza Hotel" })] }), _jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Star Category" }), _jsxs("div", { className: "relative", children: [_jsx("select", { name: "starCategory", value: formData.starCategory, onChange: handleChange, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none", children: [1, 2, 3, 4, 5].map(star => (_jsxs("option", { value: star, children: [star, " Star"] }, star))) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) }) })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Full Address" }), _jsx("textarea", { name: "address", rows: 2, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.address, onChange: handleChange, placeholder: "Street, Area, Landmark" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "City" }), _jsx("input", { type: "text", name: "city", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.city, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "State" }), _jsx("input", { type: "text", name: "state", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.state || '', onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Country" }), _jsx("input", { type: "text", name: "country", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.country || '', onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Pincode" }), _jsx("input", { type: "text", name: "pincode", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.pincode || '', onChange: handleChange })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Contact Information" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Front Desk Number" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-24 shrink-0", children: _jsx(CountryCodeSelect, { value: formData.contactCountryCode, onChange: (val) => handleCountryCodeChange('contactCountryCode', val) }) }), _jsx("input", { type: "tel", name: "contactNumber", required: true, placeholder: "10 digits", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.contactNumber, onChange: handleChange })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Official Email" }), _jsx("input", { type: "email", name: "contactEmail", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.contactEmail, onChange: handleChange, placeholder: "reservations@hotel.com" })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Hotel Manager / Supervisor" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Manager Name" }), _jsx("input", { type: "text", name: "supervisorName", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorName, onChange: handleChange, placeholder: "Full Name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Manager Email" }), _jsx("input", { type: "email", name: "supervisorEmail", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorEmail, onChange: handleChange, placeholder: "manager@hotel.com" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Direct Contact" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-24 shrink-0", children: _jsx(CountryCodeSelect, { value: formData.supervisorCountryCode, onChange: (val) => handleCountryCodeChange('supervisorCountryCode', val) }) }), _jsx("input", { type: "tel", name: "supervisorContact", placeholder: "10 digits", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorContact, onChange: handleChange })] })] })] })] }), _jsx("div", { className: "flex justify-end pt-4", children: _jsx("button", { type: "submit", disabled: loading, className: "bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 min-w-[200px]", children: loading ? 'Saving Profile...' : 'Save Hotel Profile' }) })] })] }), _jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-4", children: "Why a Complete Profile?" }), _jsxs("ul", { className: "space-y-4", children: [_jsxs("li", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold", children: "\u2713" }), _jsxs("p", { className: "text-xs text-slate-500 leading-relaxed", children: ["Complete profiles receive ", _jsx("span", { className: "font-bold text-slate-700", children: "3x more booking requests" }), " from corporate clients."] })] }), _jsxs("li", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold", children: "\u2713" }), _jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Builds immediate trust by showing verified location and contact details." })] })] })] }), _jsxs("div", { className: "bg-slate-50 rounded-xl border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-4", children: "What Corporates Look For" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDCCD" }), _jsx("span", { className: "text-xs font-medium text-slate-600", children: "Accurate Location & Maps" })] }), _jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDCDE" }), _jsx("span", { className: "text-xs font-medium text-slate-600", children: "Direct Contact Availability" })] }), _jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3", children: [_jsx("span", { className: "text-xl", children: "\u2B50" }), _jsx("span", { className: "text-xs font-medium text-slate-600", children: "Verified Star Category" })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-3", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside text-xs text-slate-500 space-y-2", children: [_jsx("li", { children: "Update pricing seasonally." }), _jsx("li", { children: "Ensure the Front Desk number is 24/7." }), _jsx("li", { children: "Verify your GST/Tax details (in billing)." })] })] }), _jsxs("div", { className: "bg-emerald-50 rounded-xl border border-emerald-100 p-5 text-center", children: [_jsx("div", { className: "mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3", children: _jsx("svg", { className: "w-6 h-6 text-emerald-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "font-bold text-emerald-900 text-sm", children: "Verified Partner Status" }), _jsx("p", { className: "text-[10px] text-emerald-800/70 mt-2 leading-relaxed", children: "Your profile is marked as a verified hotel partner, giving you priority in search results." })] })] })] }) })] }));
};
