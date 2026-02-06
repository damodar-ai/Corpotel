import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';

export const RoleSelectionPage: React.FC = () => {
    const { updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSelectRole = async (role: 'Hotel' | 'Corporate') => {
        setLoading(true);
        try {
            const response = await userService.setIdentity(role);

            // Save the new token with updated identityType
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            updateUser({ identityType: role });

            if (role === 'Hotel') {
                navigate('/complete-profile/hotel');
            } else {
                navigate('/complete-profile/corporate');
            }
        } catch (error) {
            console.error('Failed to set role:', error);
            // Handle error (maybe show toast)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
                <div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                    CorpHotel
                </div>
                <div className="text-sm text-slate-500 hidden sm:block">Already have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Log in</span></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 py-12">
                <div className="max-w-5xl w-full space-y-12">
                    {/* Text Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Choose Your Path</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            Join our premium network tailored for corporate business. Select how you want to use CorpHotel to get started.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                        {/* Hotel Card */}
                        <button
                            onClick={() => handleSelectRole('Hotel')}
                            disabled={loading}
                            className="group relative flex flex-col items-start p-8 md:p-10 bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200 hover:border-blue-500/50 transition-all duration-300 text-left transform hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>

                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-300 shadow-sm group-hover:shadow-blue-500/30">
                                <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Hotel Partner</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                                List your property, manage real-time inventory, and receive high-value corporate bookings directly.
                            </p>
                            <ul className="space-y-3 mb-8 w-full">
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Verify your property
                                </li>
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Access corporate deals
                                </li>
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Manage bookings easily
                                </li>
                            </ul>
                            <span className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                                Continue as Hotel <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </span>
                        </button>

                        {/* Corporate Card */}
                        <button
                            onClick={() => handleSelectRole('Corporate')}
                            disabled={loading}
                            className="group relative flex flex-col items-start p-8 md:p-10 bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 text-left transform hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-24 h-24 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>

                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors duration-300 shadow-sm group-hover:shadow-emerald-500/30">
                                <svg className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Corporate Business</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                                Book hotels for your company employees, manage travel expenses, and access exclusive rates.
                            </p>
                            <ul className="space-y-3 mb-8 w-full">
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Exclusive B2B Rates
                                </li>
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Centralized Billing
                                </li>
                                <li className="flex items-center text-sm text-slate-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</div>
                                    Employee Management
                                </li>
                            </ul>
                            <span className="mt-auto inline-flex items-center text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                                Continue as Business <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </span>
                        </button>
                    </div>

                    {/* Trust Section */}
                    <div className="border-t border-slate-200 pt-10 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by industry leaders for secure bookings</p>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-80">
                            <div className="flex items-center gap-2 group cursor-default">
                                <div className="p-2 bg-slate-100 rounded-lg"><svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                                <span className="font-semibold text-slate-700 text-sm">Secure Onboarding</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default">
                                <div className="p-2 bg-slate-100 rounded-lg"><svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                                <span className="font-semibold text-slate-700 text-sm">Verified Partners</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default">
                                <div className="p-2 bg-slate-100 rounded-lg"><svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                                <span className="font-semibold text-slate-700 text-sm">Instant Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
