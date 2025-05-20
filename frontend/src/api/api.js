import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.18.2:5000',
    headers: {
        
        'Content-Type': 'application/json',
    },
});
export const fetchHotels = () => api.get('/hotels');
export const fetchHotelById = (id) => api.get(`/hotels/${id}`);

export const fetchRooms = (hotelId) => api.get(`/rooms/${hotelId}`);
export const addRoom = (hotelId, room) => api.post(`/rooms/${hotelId}`, room);
export const updateRoom = (hotelId, roomId, room) => api.patch(`/rooms/${hotelId}/${roomId}`, room);
export const deleteRoom = (hotelId, roomId) => api.delete(`/rooms/${hotelId}/${roomId}`);

export const fetchReservations = (hotelId) => api.get(`/reservations/${hotelId}`);
export const addReservation = (hotelId, reservation) => api.post(`/reservations/${hotelId}`, reservation);
export const updateReservation = (hotelId, reservationId, reservation) => api.patch(`/reservations/${hotelId}/${reservationId}`, reservation);
export const deleteReservation = (hotelId, reservationId) => api.delete(`/reservations/${hotelId}/${reservationId}`);

export const fetchNote = (hotelId, reservationId) => api.get(`/reservations/${hotelId}/${reservationId}`);
export const updateNote = (hotelId, reservationId, note) => api.patch(`/reservations/${hotelId}/${reservationId}`, { note });

export const fetchAdminLogin = (username, password) => api.post('/admins/login', { username, password });

export default api;