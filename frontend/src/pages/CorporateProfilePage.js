import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { CountryCodeSelect } from '../components/CountryCodeSelect';
export const CorporateProfilePage = () => {
    const { updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        industryType: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        officeAddress: '',
        contactCountryCode: '+1',
        contactNumber: '',
        contactEmail: '',
        supervisorName: '',
        supervisorEmail: '',
        supervisorCountryCode: '+1',
        supervisorContact: ''
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
                const response = await userService.getCorporateProfile();
                if (response.data) {
                    const { CompanyName, IndustryType, OfficeAddress, ContactNumber, ContactEmail, SupervisorName, SupervisorEmail, SupervisorContact } = response.data;
                    // Simple parsing for country code if needed, or just set raw for now if not splitting
                    // For this implementation, I'll just load the full number into contactNumber if it exists
                    // Ideally we'd split it, but for simplicity:
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
                        companyName: CompanyName || '',
                        industryType: IndustryType || '',
                        city: response.data.City || '',
                        state: response.data.State || '',
                        country: response.data.Country || '',
                        pincode: response.data.Pincode || '',
                        officeAddress: OfficeAddress || '',
                        contactCountryCode: contactPhone.code,
                        contactNumber: contactPhone.number,
                        contactEmail: ContactEmail || '',
                        supervisorName: SupervisorName || '',
                        supervisorEmail: SupervisorEmail || '',
                        supervisorCountryCode: supervisorPhone.code,
                        supervisorContact: supervisorPhone.number
                    });
                    setIsViewMode(true);
                }
            }
            catch (error) {
                console.log('No existing profile found or error fetching:', error);
            }
        };
        fetchProfile();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                contactNumber: formData.contactCountryCode + formData.contactNumber,
                supervisorContact: formData.supervisorCountryCode + formData.supervisorContact
            };
            const response = await userService.createCorporateProfile(payload);
            // Save the new token with Corporate identityType
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            updateUser({ isProfileCompleted: true, identityType: 'Corporate' });
            navigate('/corporate/dashboard');
        }
        catch (error) {
            console.error('Failed to create/update profile:', error);
            // Handle error
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900 pb-24", children: [_jsx("div", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Corporate Profile" }), _jsx("p", { className: "text-sm text-slate-500", children: "Manage your company details and preferences" })] }), _jsx("div", { children: _jsxs("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${isViewMode ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full mr-2 ${isViewMode ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}` }), isViewMode ? 'Profile Active' : 'Setup Required'] }) })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [_jsx("div", { className: "lg:col-span-2 space-y-8", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Company Details" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Company Name" }), _jsx("input", { type: "text", name: "companyName", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.companyName, onChange: handleChange, placeholder: "e.g. Acme Corp" })] }), _jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Industry Type" }), _jsx("input", { type: "text", name: "industryType", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.industryType, onChange: handleChange, placeholder: "e.g. Technology" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Office Address" }), _jsx("textarea", { name: "officeAddress", rows: 2, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.officeAddress, onChange: handleChange, placeholder: "Full registered office address" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "City" }), _jsx("input", { type: "text", name: "city", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.city || '', onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "State" }), _jsx("input", { type: "text", name: "state", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.state || '', onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Country" }), _jsx("input", { type: "text", name: "country", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.country || '', onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Pincode" }), _jsx("input", { type: "text", name: "pincode", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.pincode || '', onChange: handleChange })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Contact Information" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Primary Email" }), _jsx("input", { type: "email", name: "contactEmail", required: true, className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.contactEmail, onChange: handleChange, placeholder: "contact@company.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Phone Number" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-24 shrink-0", children: _jsx(CountryCodeSelect, { value: formData.contactCountryCode, onChange: (val) => handleCountryCodeChange('contactCountryCode', val) }) }), _jsx("input", { type: "tel", name: "contactNumber", required: true, placeholder: "10 digits", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.contactNumber, onChange: handleChange })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }), _jsx("h2", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Supervisor / Manager Details" })] }), _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "supervisorName", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorName, onChange: handleChange, placeholder: "Supervisor's Name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Email" }), _jsx("input", { type: "email", name: "supervisorEmail", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorEmail, onChange: handleChange, placeholder: "supervisor@company.com" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Contact Number" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-24 shrink-0", children: _jsx(CountryCodeSelect, { value: formData.supervisorCountryCode, onChange: (val) => handleCountryCodeChange('supervisorCountryCode', val) }) }), _jsx("input", { type: "tel", name: "supervisorContact", placeholder: "10 digits", className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400", value: formData.supervisorContact, onChange: handleChange })] })] })] })] }), _jsx("div", { className: "flex justify-end pt-4", children: _jsx("button", { type: "submit", disabled: loading, className: "bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 min-w-[200px]", children: loading ? 'Saving Changes...' : 'Save Profile Changes' }) })] }) }), _jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-4", children: "Why Keep Your Profile Updated?" }), _jsxs("ul", { className: "space-y-4", children: [_jsxs("li", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold", children: "1" }), _jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Helps hotels understand your specific corporate requirements immediately." })] }), _jsxs("li", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold", children: "2" }), _jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Speeds up the booking approval process by providing verified company details." })] })] })] }), _jsxs("div", { className: "bg-slate-50 rounded-xl border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-4", children: "How Hotels Use Your Information" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3", children: [_jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { className: "text-xs font-medium text-slate-600", children: "Verifying Corporate Identity" })] }), _jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3", children: [_jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), _jsx("span", { className: "text-xs font-medium text-slate-600", children: "Meeting Setup Preparation" })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-5", children: [_jsx("h3", { className: "font-bold text-slate-900 text-sm mb-3", children: "Profile Management Tips" }), _jsxs("ul", { className: "list-disc list-inside text-xs text-slate-500 space-y-2", children: [_jsx("li", { children: "Ensure contact numbers include country codes." }), _jsx("li", { children: "Update supervisor details if they change." }), _jsx("li", { children: "Keep office address current for invoicing." })] })] }), _jsxs("div", { className: "bg-indigo-50 rounded-xl border border-indigo-100 p-5", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("svg", { className: "w-4 h-4 text-indigo-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }), _jsx("h3", { className: "font-bold text-indigo-900 text-sm opacity-90", children: "Secure Platform" })] }), _jsx("p", { className: "text-[10px] text-indigo-800/70 leading-relaxed", children: "Your data is encrypted and stored securely. We only share relevant booking details with verified hotel partners." })] })] })] }) })] }));
};
