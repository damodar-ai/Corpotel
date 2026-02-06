import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { CountryCodeSelect } from '../components/CountryCodeSelect';

export const HotelProfilePage: React.FC = () => {
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
                const response = await userService.getHotelProfile();
                if (response.data) {
                    const {
                        HotelName, City, Address,
                        ContactNumber, ContactEmail,
                        SupervisorName, SupervisorEmail, SupervisorContact,
                        StarCategory
                    } = response.data;

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
                        hotelName: HotelName || '',
                        city: City || '',
                        state: (response.data as any).State || '',
                        country: (response.data as any).Country || '',
                        pincode: (response.data as any).Pincode || '',
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
            } catch (error) {
                // Ignore 404, valid for new profiles
                console.log('No existing profile found or error fetching:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (error: any) {
            console.error('Failed to create/update profile:', error);
            setError(error.response?.data?.error || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const [error, setError] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Hotel Partner Profile</h1>
                        <p className="text-sm text-slate-500">Manage your property details and visibility</p>
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
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Hotel Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Property Details</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hotel Name</label>
                                        <input
                                            type="text"
                                            name="hotelName"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.hotelName}
                                            onChange={handleChange}
                                            placeholder="e.g. Grand Plaza Hotel"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Star Category</label>
                                        <div className="relative">
                                            <select
                                                name="starCategory"
                                                value={formData.starCategory}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <option key={star} value={star}>{star} Star</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                                        <textarea
                                            name="address"
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Street, Area, Landmark"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.city}
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
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Contact Information</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Front Desk Number</label>
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
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Official Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            placeholder="reservations@hotel.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Supervisor Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Hotel Manager / Supervisor</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manager Name</label>
                                        <input
                                            type="text"
                                            name="supervisorName"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.supervisorName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manager Email</label>
                                        <input
                                            type="email"
                                            name="supervisorEmail"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                            value={formData.supervisorEmail}
                                            onChange={handleChange}
                                            placeholder="manager@hotel.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Direct Contact</label>
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
                                    {loading ? 'Saving Profile...' : 'Save Hotel Profile'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* RIGHT COLUMN: Informational Sidebars */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Why Complete Profile Matters */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Why a Complete Profile?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Complete profiles receive <span className="font-bold text-slate-700">3x more booking requests</span> from corporate clients.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Builds immediate trust by showing verified location and contact details.</p>
                                </li>
                            </ul>
                        </div>

                        {/* How Corporates View Profile */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">What Corporates Look For</h3>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                    <span className="text-xl">📍</span>
                                    <span className="text-xs font-medium text-slate-600">Accurate Location & Maps</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                    <span className="text-xl">📞</span>
                                    <span className="text-xs font-medium text-slate-600">Direct Contact Availability</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                    <span className="text-xl">⭐</span>
                                    <span className="text-xs font-medium text-slate-600">Verified Star Category</span>
                                </div>
                            </div>
                        </div>

                        {/* Best Practices */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-3">Best Practices</h3>
                            <ul className="list-disc list-inside text-xs text-slate-500 space-y-2">
                                <li>Update pricing seasonally.</li>
                                <li>Ensure the Front Desk number is 24/7.</li>
                                <li>Verify your GST/Tax details (in billing).</li>
                            </ul>
                        </div>

                        {/* Verified Presence */}
                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 text-center">
                            <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="font-bold text-emerald-900 text-sm">Verified Partner Status</h3>
                            <p className="text-[10px] text-emerald-800/70 mt-2 leading-relaxed">
                                Your profile is marked as a verified hotel partner, giving you priority in search results.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
