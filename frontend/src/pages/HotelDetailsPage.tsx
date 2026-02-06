import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { browseHotelService } from '../services';

interface HotelDetails {
  Id: number;
  HotelName: string;
  Description: string;
  Address: string;
  City: string;
  Country: string;
  StarCategory: number;
  totalRooms: number;
  Amenities: string[];
  ContactEmail: string;
  ContactNumber: string;
}

interface RoomType {
  Id: number;
  Name: string;
  Description: string;
  Capacity: number;
  BasePrice: number;
  CorporatePrice: number;
  Amenities: string[];
}

export const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHotelDetails();
  }, [id]);

  const loadHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await browseHotelService.getHotelDetails(Number(id));
      setHotel(response.data.hotel);
      setRooms(response.data.roomTypes);
    } catch (err) {
      console.error('Failed to load hotel details:', err);
      setError('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomTypeId: number) => {
    const params = new URLSearchParams();
    params.append('hotelId', id!);
    params.append('roomTypeId', roomTypeId.toString());

    navigate(`/bookings/request?${params.toString()}`);
  };

  if (loading && !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce">🏨</div>
          <p className="text-gray-600 text-lg">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 mb-6 text-lg font-bold">Hotel not found</p>
          <button onClick={() => navigate('/hotels')} className="bg-gradient-to-r from-secondary to-secondary-light hover:shadow-lg hover:shadow-secondary/50 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
            ← Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Hotel Header */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary text-white py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => navigate('/hotels')} className="text-white hover:text-accent mb-6 flex items-center gap-2 transition-all duration-300 transform hover:translate-x-2">
            <span className="text-2xl">←</span> <span className="font-semibold">Back to Hotels</span>
          </button>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl animate-bounce">🏨</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{hotel.HotelName}</h1>
              <p className="text-gray-100 text-lg mb-3">📍 {hotel.Address}, {hotel.City}, {hotel.Country}</p>
              <div className="flex flex-wrap gap-4 text-lg font-semibold">
                <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">⭐ {hotel.StarCategory} Star</span>
                <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">🛏️ {hotel.totalRooms} rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hotel Info */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="text-4xl">ℹ️</span>
            About This Hotel
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{hotel.Description || 'No description available'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-primary mb-4 text-lg flex items-center gap-2">
                <span className="text-2xl">📧</span>
                Contact Information
              </h3>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {hotel.ContactEmail || 'Not available'}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {hotel.ContactNumber || 'Not available'}</p>
            </div>

            {hotel.Amenities && hotel.Amenities.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <h3 className="font-bold text-primary mb-4 text-lg flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Hotel Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.Amenities.map((amenity, index) => (
                    <span key={index} className="bg-white text-primary px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Rooms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8 animate-slide-up flex items-center gap-3">
            <span className="text-4xl">🛏️</span>
            Available Room Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <div 
                key={room.Id} 
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-secondary/30 group animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                {/* Card Header with gradient */}
                <div className="h-2 bg-gradient-to-r from-secondary to-secondary-light"></div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {room.Name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{room.Description}</p>

                  {/* Capacity */}
                  <div className="flex items-center gap-3 mb-4 bg-blue-50 p-3 rounded-xl">
                    <span className="text-2xl">👥</span>
                    <span className="text-gray-700 font-semibold">Capacity: <strong className="text-primary">{room.Capacity} guests</strong></span>
                  </div>

                  {/* Amenities */}
                  {room.Amenities && room.Amenities.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                        <span>✨</span>
                        Room Amenities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room.Amenities.map((amenity, amenityIndex) => (
                          <span key={amenityIndex} className="bg-gradient-to-r from-accent/20 to-orange-500/20 text-accent px-3 py-1 rounded-full text-xs font-semibold border border-accent/30">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Section */}
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-1">Standard Price</p>
                      <p className="text-3xl font-bold text-primary">₹{room.BasePrice}<span className="text-lg text-gray-600">/night</span></p>
                    </div>
                    {room.CorporatePrice && room.CorporatePrice < room.BasePrice && (
                      <div className="mb-6 bg-gradient-to-r from-accent/10 to-orange-500/10 p-3 rounded-xl border border-accent/20">
                        <p className="text-gray-600 text-sm mb-1">Corporate Price</p>
                        <p className="text-3xl font-bold text-gradient">₹{room.CorporatePrice}<span className="text-lg text-gray-600">/night</span></p>
                        <p className="text-xs text-green-600 mt-1">💰 Save {Math.round(((room.BasePrice - room.CorporatePrice) / room.BasePrice) * 100)}%</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleBookRoom(room.Id)}
                      className="w-full bg-gradient-to-r from-secondary to-secondary-light hover:shadow-lg hover:shadow-secondary/50 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      ✨ Raise Booking Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {rooms.length === 0 && !loading && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 animate-slide-up">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">No room types available for this hotel yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
