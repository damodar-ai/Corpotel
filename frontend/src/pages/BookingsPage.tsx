import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { useNavigate } from 'react-router-dom';

interface Booking {
  Id: number;
  BookingNumber: string;
  hotelName: string;
  roomTypeName: string;
  CheckInDate: string;
  CheckOutDate: string;
  TotalPrice: number;
  BookingStatus: string;
}

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, navigate]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookings(filter || undefined);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        loadBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'cancelled':
        return 'bg-slate-100 text-slate-500 border border-slate-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '●'; // Dot for clean look
      case 'pending':
        return '○';
      case 'cancelled':
        return '×';
      case 'completed':
        return '✓';
      default:
        return '○';
    }
  };

  // Frontend Logic Validation: Strict Filter
  const filteredBookings = bookings.filter(booking => {
    if (filter === '') return true; // Show all
    return booking.BookingStatus.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3">Corporate Travel Management</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Corporate Bookings Board
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Track, manage, and audit all your corporate hotel reservations in one centralized dashboard.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Buttons */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {['', 'confirmed', 'pending', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); loadBookings(); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filter === status
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {status === '' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1)}
              {filter === status && <span className="text-xs bg-white/20 px-1.5 rounded-full">✓</span>}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-40 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📅</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {filter ? `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings` : 'No Bookings Found'}
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {filter
                ? `You don't have any bookings with ${filter} status.`
                : "You haven't made any bookings yet."}
            </p>
            {user?.identityType !== 'Hotel' && (
              <button
                onClick={() => navigate('/corporate/find-hotels')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm hover:shadow-md"
              >
                Find a Hotel
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.Id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group"
              >
                {/* Main Info */}
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 w-fit ${getStatusBadgeColor(booking.BookingStatus)}`}>
                      {getStatusIcon(booking.BookingStatus)}
                      {booking.BookingStatus}
                    </span>
                    <span className="text-xs text-slate-400 font-mono tracking-wider">#{booking.BookingNumber}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {booking.hotelName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <span>🛏️</span> {booking.roomTypeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Check In</p>
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(booking.CheckInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-100"></div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Check Out</p>
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(booking.CheckOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-2 min-w-[140px] border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total</p>
                    <p className="text-xl font-bold text-slate-900">₹{booking.TotalPrice.toLocaleString()}</p>
                  </div>

                  {booking.BookingStatus.toLowerCase() === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking.Id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informational Sections */}
        <div className="border-t border-slate-200 mt-16 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">👔</span>
              Manage Your Corporate Bookings Easily
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 text-slate-400">👀</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Real-time Visibility</h4>
                  <p className="text-slate-500 text-sm mt-1">View status updates instantly as requests are confirmed by our hotel partners.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-slate-400">📝</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Easy Modifications</h4>
                  <p className="text-slate-500 text-sm mt-1">Need to change plans? Cancel or modify bookings directly from your dashboard with one click.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/5 border border-slate-200 p-8 rounded-2xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Centralized Booking Experience</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              CorpHotel streamlines your travel auditing by keeping all reservation data, invoices, and compliance checks in one secure, accessible location.
            </p>
            <div className="flex gap-3">
              <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm">Secure</span>
              <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm">Auditable</span>
              <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-600 shadow-sm">Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
