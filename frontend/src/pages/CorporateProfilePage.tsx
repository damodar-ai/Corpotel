import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { CountryCodeSelect } from '../components/CountryCodeSelect';

export const CorporateProfilePage: React.FC = () => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryCodeChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getCorporateProfile();
                if (response.data) {
                    const {
                        CompanyName, IndustryType, OfficeAddress,
                        ContactNumber, ContactEmail,
                        SupervisorName, SupervisorEmail, SupervisorContact
                    } = response.data;

                    // Simple parsing for country code if needed, or just set raw for now if not splitting
                    // For this implementation, I'll just load the full number into contactNumber if it exists
                    // Ideally we'd split it, but for simplicity:

                    // Parse phone numbers
                    const parsePhone = (fullNumber: string) => {
                        if (!fullNumber) return { code: '+1', number: '' };
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
                        city: (response.data as any).City || '',
                        state: (response.data as any).State || '',
                        country: (response.data as any).Country || '',
                        pincode: (response.data as any).Pincode || '',
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
            } catch (error) {
                console.log('No existing profile found or error fetching:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (error) {
            console.error('Failed to create/update profile:', error);
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Corporate Profile</h1>
                        <p className="text-sm text-slate-500">Manage your company details and preferences</p>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${isViewMode ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${isViewMode ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                            {isViewMode ? 'Profile Active' : 'Setup Required'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN: Editor Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Company Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Company Details</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Industry Type</label>
                                        <input
                                            type="text"
                                            name="industryType"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.industryType}
                                            onChange={handleChange}
                                            placeholder="e.g. Technology"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Address</label>
                                        <textarea
                                            name="officeAddress"
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.officeAddress}
                                            onChange={handleChange}
                                            placeholder="Full registered office address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={(formData as any).city || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={(formData as any).state || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={(formData as any).country || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={(formData as any).pincode || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Contact Information</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            placeholder="contact@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                        <div className="flex gap-2">
                                            <div className="w-24 shrink-0">
                                                <CountryCodeSelect
                                                    value={formData.contactCountryCode}
                                                    onChange={(val) => handleCountryCodeChange('contactCountryCode', val)}
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                required
                                                placeholder="10 digits"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Supervisor Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Supervisor / Manager Details</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="supervisorName"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.supervisorName}
                                            onChange={handleChange}
                                            placeholder="Supervisor's Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="supervisorEmail"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.supervisorEmail}
                                            onChange={handleChange}
                                            placeholder="supervisor@company.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Number</label>
                                        <div className="flex gap-2">
                                            <div className="w-24 shrink-0">
                                                <CountryCodeSelect
                                                    value={formData.supervisorCountryCode}
                                                    onChange={(val) => handleCountryCodeChange('supervisorCountryCode', val)}
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                name="supervisorContact"
                                                placeholder="10 digits"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                                value={formData.supervisorContact}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 min-w-[200px]"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* RIGHT COLUMN: Informational Sidebars */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Why Keep Updated */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Why Keep Your Profile Updated?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Helps hotels understand your specific corporate requirements immediately.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Speeds up the booking approval process by providing verified company details.</p>
                                </li>
                            </ul>
                        </div>

                        {/* How Hotels Use Info */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">How Hotels Use Your Information</h3>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <span className="text-xs font-medium text-slate-600">Verifying Corporate Identity</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    <span className="text-xs font-medium text-slate-600">Meeting Setup Preparation</span>
                                </div>
                            </div>
                        </div>

                        {/* Management Tips */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-3">Profile Management Tips</h3>
                            <ul className="list-disc list-inside text-xs text-slate-500 space-y-2">
                                <li>Ensure contact numbers include country codes.</li>
                                <li>Update supervisor details if they change.</li>
                                <li>Keep office address current for invoicing.</li>
                            </ul>
                        </div>

                        {/* Secure Platform Assurance */}
                        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                <h3 className="font-bold text-indigo-900 text-sm opacity-90">Secure Platform</h3>
                            </div>
                            <p className="text-[10px] text-indigo-800/70 leading-relaxed">
                                Your data is encrypted and stored securely. We only share relevant booking details with verified hotel partners.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
