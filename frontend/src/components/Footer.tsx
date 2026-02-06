import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans relative overflow-hidden">
      {/* Subtle Texture/Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900 pointer-events-none"></div>

      {/* Pre-Footer CTA */}
      <div className="relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Plan Your Next Corporate Event with Confidence</h3>
            <p className="text-slate-400">Join thousands of companies streamlining their travel and meetings.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-emerald-900/20">
              Get Started
            </Link>
            <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 border border-slate-700">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">

          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-mono">
                C
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CorpHotel</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              The premier platform for corporate hotel bookings, meeting spaces, and event management. Simplified for modern business.
            </p>
            <div className="flex gap-4">
              {/* Social Icons (Placeholders) */}
              {['linkedin', 'twitter', 'facebook'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current rounded-sm opacity-50"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="/#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><a href="/#why-choose-us" className="hover:text-blue-400 transition-colors">Why CorpHotel</a></li>
              <li><a href="/#compare" className="hover:text-blue-400 transition-colors">Compare Venues</a></li>
              <li><a href="/#partners" className="hover:text-blue-400 transition-colors">Trusted Partners</a></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h4 className="text-white font-bold mb-6">Solutions</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="/#compare" className="hover:text-blue-400 transition-colors">Meetings & Conferences</a></li>
              <li><a href="/#how-it-works" className="hover:text-blue-400 transition-colors">Corporate Events</a></li>
              <li><a href="/#why-choose-us" className="hover:text-blue-400 transition-colors">Team Offsites</a></li>
              <li><a href="/#cta" className="hover:text-blue-400 transition-colors">Start Booking</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/partners" className="hover:text-blue-400 transition-colors">Partners</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5: Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {currentYear} CorpHotel. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>System Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
