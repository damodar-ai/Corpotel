import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- UI Components ---

// Sidebar Navigation Item
const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${active
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <span className={`text-lg transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
            {icon}
        </span>
        {label}
    </button>
);

// Skeleton Loader Component
const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-slate-100 animate-pulse rounded ${className}`}></div>
);

// Stat Card (UI Shell)
const StatCardShell = ({ label, icon }: { label: string, icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
            <div className="text-slate-400 bg-slate-50 p-2 rounded-lg text-xl">{icon}</div>
            <Skeleton className="h-4 w-12 rounded-full" /> {/* Trend Indicator Placeholder */}
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
            <Skeleton className="h-8 w-24" /> {/* Value Placeholder */}
        </div>
    </div>
);

// Quick Action Card
const QuickActionCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left bg-white group"
    >
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
    </button>
);

export const CorporateDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Removed 'user' dependency to avoid using data
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif italic">C</div>
                        CorpSpace
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</div>
                    <NavItem icon={<span className="icon-dashboard">📊</span>} label="Dashboard" active />
                    <NavItem icon={<span className="icon-search">🔍</span>} label="Find Hotels" onClick={() => navigate('/hotels')} />

                    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-8">Manage</div>
                    <NavItem icon={<span className="icon-calendar">📅</span>} label="Bookings" onClick={() => navigate('/bookings')} />
                    <NavItem icon={<span className="icon-card">💳</span>} label="Payments" />
                    <NavItem icon={<span className="icon-users">👥</span>} label="Team" />

                    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-8">Account</div>
                    <NavItem icon={<span className="icon-settings">⚙️</span>} label="Settings" />
                    <NavItem icon={<span className="icon-help">❓</span>} label="Support" />
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Header (Top Bar) */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="text-slate-500">☰</button>
                        <span className="font-bold text-slate-900">Dashboard</span>
                    </div>

                    {/* Desktop Header Content */}
                    <div className="hidden lg:flex items-center justify-between w-full">
                        <h2 className="text-xl font-bold text-slate-800">Corporate Portal</h2>

                        <div className="flex items-center gap-6">
                            <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                                🔔
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-3 w-16 ml-auto" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                    👤
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Layout */}
                <div className="p-4 sm:p-8 space-y-8 flex-1 overflow-y-auto">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCardShell label="Active Bookings" icon="📅" />
                        <StatCardShell label="Total Spend" icon="💰" />
                        <StatCardShell label="Upcoming Trips" icon="✈️" />
                        <StatCardShell label="Team Members" icon="👥" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Block (Active Bookings / Table Shell) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">Recent Activity</h3>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="p-6">
                                    {/* Table Header Shell */}
                                    <div className="grid grid-cols-4 gap-4 mb-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-2">Item</div>
                                        <div>Date</div>
                                        <div className="text-right">Status</div>
                                    </div>

                                    {/* Skeleton Rows */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="grid grid-cols-4 gap-4 items-center mb-6 last:mb-0">
                                            <div className="col-span-2 flex items-center gap-3">
                                                <Skeleton className="w-10 h-10 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                            <div><Skeleton className="h-4 w-20" /></div>
                                            <div className="justify-self-end"><Skeleton className="h-6 w-16 rounded-full" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Quick Actions & Promo) */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <QuickActionCard
                                        icon="🏨"
                                        title="Find Hotels"
                                        desc="Search and book venues"
                                        onClick={() => navigate('/hotels')}
                                    />
                                    <QuickActionCard
                                        icon="📋"
                                        title="My Itinerary"
                                        desc="View upcoming schedule"
                                        onClick={() => navigate('/bookings')}
                                    />
                                    <QuickActionCard
                                        icon="🤵"
                                        title="Concierge"
                                        desc="Request special services"
                                        onClick={() => { }}
                                    />
                                </div>
                            </div>

                            {/* Promo / Banner Shell */}
                            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl mb-4">✨</div>
                                    <h3 className="font-bold text-lg mb-2">Corporate Benefits</h3>
                                    <p className="text-blue-100 text-sm mb-4 opacity-80">Unlock exclusive rates and premium services.</p>
                                    <button className="text-sm font-bold bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                        View Details
                                    </button>
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
