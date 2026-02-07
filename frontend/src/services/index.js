import api from './api';
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password, firstName, lastName) => api.post('/auth/register', { email, password, firstName, lastName }),
    getProfile: () => api.get('/auth/profile'),
    getGoogleAuthUrl: () => api.get('/auth/google/url'),
    loginWithGoogle: (code) => api.post('/auth/google/callback', { code }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
export const bookingService = {
    createBooking: (bookingData) => api.post('/bookings', bookingData),
    getBookings: (status) => api.get('/bookings', { params: { ...(status && { status }) } }),
    getBookingDetails: (id) => api.get(`/bookings/${id}`),
    cancelBooking: (id) => api.put(`/bookings/${id}/cancel`, {}),
    // Hotel owner endpoints
    getHotelBookings: (status) => api.get('/bookings/hotel', { params: { ...(status && { status }) } }),
    approveBooking: (id) => api.put(`/bookings/${id}/approve`, {}),
    rejectBooking: (id, reason) => api.put(`/bookings/${id}/reject`, { reason }),
};
export const userService = {
    setIdentity: (identityType) => api.post('/users/set-identity', { identityType }),
    createHotelProfile: (data) => api.post('/profiles/hotel', data),
    getHotelProfile: () => api.get('/profiles/hotel/me'),
    createCorporateProfile: (data) => api.post('/profiles/corporate', data),
    getCorporateProfile: () => api.get('/profiles/corporate/me'),
};
// Room Types Service (for Hotel owners)
export const roomTypeService = {
    getRoomTypes: () => api.get('/room-types'),
    getRoomType: (id) => api.get(`/room-types/${id}`),
    createRoomType: (data) => api.post('/room-types', data),
    updateRoomType: (id, data) => api.put(`/room-types/${id}`, data),
    deleteRoomType: (id) => api.delete(`/room-types/${id}`),
};
export const browseHotelService = {
    getHotels: (page = 1, limit = 12, city, filters) => api.get('/browse/hotels', {
        params: {
            page,
            limit,
            ...(city && { city }),
            ...filters
        }
    }),
    searchHotels: (filters) => api.get('/browse/hotels', { params: filters }),
    getHotelDetails: (id, checkIn, checkOut) => api.get(`/browse/hotels/${id}`, { params: { checkIn, checkOut } }),
    getAvailableRooms: (hotelId, checkIn, checkOut, roomTypeId) => api.get(`/browse/hotels/${hotelId}/available-rooms`, { params: { checkIn, checkOut, roomTypeId } }),
    getCities: () => api.get('/browse/hotels/search/cities'),
    getPriceRange: () => api.get('/browse/hotels/search/price-range'),
};
