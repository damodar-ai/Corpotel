import api from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/auth/register', { email, password, firstName, lastName }),

  getProfile: () =>
    api.get('/auth/profile'),

  getGoogleAuthUrl: () =>
    api.get('/auth/google/url'),

  loginWithGoogle: (code: string) =>
    api.post('/auth/google/callback', { code }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};


export const bookingService = {
  createBooking: (bookingData: any) =>
    api.post('/bookings', bookingData),

  getBookings: (status?: string) =>
    api.get('/bookings', { params: { ...(status && { status }) } }),

  getBookingDetails: (id: number) =>
    api.get(`/bookings/${id}`),

  cancelBooking: (id: number) =>
    api.put(`/bookings/${id}/cancel`, {}),

  // Hotel owner endpoints
  getHotelBookings: (status?: string) =>
    api.get('/bookings/hotel', { params: { ...(status && { status }) } }),

  approveBooking: (id: number) =>
    api.put(`/bookings/${id}/approve`, {}),

  rejectBooking: (id: number, reason?: string) =>
    api.put(`/bookings/${id}/reject`, { reason }),
};


export const userService = {
  setIdentity: (identityType: 'Hotel' | 'Corporate') =>
    api.post('/users/set-identity', { identityType }),

  createHotelProfile: (data: any) =>
    api.post('/profiles/hotel', data),

  getHotelProfile: () =>
    api.get('/profiles/hotel/me'),

  createCorporateProfile: (data: any) =>
    api.post('/profiles/corporate', data),

  getCorporateProfile: () =>
    api.get('/profiles/corporate/me'),
};

// Room Types Service (for Hotel owners)
export const roomTypeService = {
  getRoomTypes: () =>
    api.get('/room-types'),

  getRoomType: (id: number) =>
    api.get(`/room-types/${id}`),

  createRoomType: (data: {
    name: string;
    description?: string;
    capacity: number;
    basePrice: number;
    corporatePrice?: number;
    amenities?: string[];
  }) => api.post('/room-types', data),

  updateRoomType: (id: number, data: any) =>
    api.put(`/room-types/${id}`, data),

  deleteRoomType: (id: number) =>
    api.delete(`/room-types/${id}`),
};



// Browse Hotels Service (for Corporates to find hotels from HotelDetails)
interface SearchFilters {
  page?: number;
  limit?: number;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  sortBy?: string;
}

export const browseHotelService = {
  getHotels: (page = 1, limit = 12, city?: string, filters?: Partial<SearchFilters>) =>
    api.get('/browse/hotels', {
      params: {
        page,
        limit,
        ...(city && { city }),
        ...filters
      }
    }),

  searchHotels: (filters: SearchFilters) =>
    api.get('/browse/hotels', { params: filters }),

  getHotelDetails: (id: number, checkIn?: string, checkOut?: string) =>
    api.get(`/browse/hotels/${id}`, { params: { checkIn, checkOut } }),

  getAvailableRooms: (hotelId: number, checkIn: string, checkOut: string, roomTypeId?: number) =>
    api.get(`/browse/hotels/${hotelId}/available-rooms`, { params: { checkIn, checkOut, roomTypeId } }),

  getCities: () =>
    api.get('/browse/hotels/search/cities'),

  getPriceRange: () =>
    api.get('/browse/hotels/search/price-range'),
};
