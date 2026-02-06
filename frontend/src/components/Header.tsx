import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          {/* <div className="text-3xl">🏨</div> */}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">CorpHotel</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 items-center">
          <a href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Home
          </a>
          {isAuthenticated && (
            <>
              {/* Corporate Navigation */}
              {user?.identityType === 'Corporate' && (
                <>
                  <a href="/corporate/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Dashboard
                  </a>
                  <a href="/corporate/find-hotels" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Find Hotels
                  </a>
                  <a href="/corporate/offers" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Special Offers
                  </a>
                  <a href="/bookings" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    My Bookings
                  </a>
                  <a href="/corporate/messages" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Messages
                  </a>
                </>
              )}
              {/* Hotel Navigation */}
              {user?.identityType === 'Hotel' && (
                <>
                  <a href="/hotel/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Dashboard
                  </a>
                  <a href="/hotel/room-types" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Room Types
                  </a>
                  <a href="/hotel/bookings" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Bookings
                  </a>
                  <a href="/hotel/posts" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    My Posts
                  </a>
                  <a href="/hotel/messages" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Messages
                  </a>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* User Menu */}
              <div className="hidden md:flex items-center gap-3 relative">
                <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-semibold text-slate-700 text-sm border border-slate-200">
                    {getInitials(user.email)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.email.split('@')[0]}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-12 right-0 bg-white text-slate-700 rounded-lg shadow-xl shadow-slate-200/50 w-48 border border-slate-100 py-1 transition-all">
                    <a
                      href={user.identityType === 'Hotel' ? '/complete-profile/hotel' : '/complete-profile/corporate'}
                      className="block px-4 py-2 hover:bg-slate-50 text-sm font-medium"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <a href="/login" className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm text-sm">
              Login
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <nav className="flex flex-col p-2 space-y-1">
            <a href="/" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            {isAuthenticated && (
              <>
                {user?.identityType === 'Corporate' && (
                  <>
                    <a href="/corporate/dashboard" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </a>
                    <a href="/corporate/find-hotels" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Find Hotels
                    </a>
                    <a href="/corporate/offers" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Special Offers
                    </a>
                    <a href="/bookings" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      My Bookings
                    </a>
                    <a href="/corporate/messages" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Messages
                    </a>
                  </>
                )}
                {user?.identityType === 'Hotel' && (
                  <>
                    <a href="/hotel/dashboard" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </a>
                    <a href="/hotel/room-types" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Room Types
                    </a>
                    <a href="/hotel/bookings" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Bookings
                    </a>
                    <a href="/hotel/posts" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      My Posts
                    </a>
                    <a href="/hotel/messages" className="px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                      Messages
                    </a>
                  </>
                )}
                {/* Profile & Logout for Mobile */}
                <div className="border-t border-slate-100 pt-2 mt-2">
                  <a
                    href={user.identityType === 'Hotel' ? '/complete-profile/hotel' : '/complete-profile/corporate'}
                    className="block px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg text-red-600 font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="border-t border-slate-100 pt-2 mt-2 px-2 pb-2">
                <a
                  href="/login"
                  className="block px-4 py-3 bg-slate-900 text-white rounded-lg font-medium text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
