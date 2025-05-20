// src/api/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Konfiguracja Axiosa
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : undefined
  }
});

// Autentykacja
export const loginAdmin = async (username:string, password:string) => {
  const response = await api.post('/admins/login', { username, password });
  return response.data;
};

// Hotele
export const fetchHotels = async () => {
  const response = await api.get('/hotels');
  return response.data;
};

export const createHotel = async (hotelData) => {
  const response = await api.post('/hotels', hotelData);
  return response.data;
};

// Pokoje
export const fetchRooms = async (hotelId) => {
  const response = await api.get(`/rooms/${hotelId}`);
  return response.data;
};

export const createRoom = async (hotelId, roomData) => {
  const response = await api.post(`/rooms/${hotelId}`, { ...roomData, hotel_id: hotelId });
  return response.data;
};

// Rezerwacje
export const fetchReservations = async (hotelId) => {
  const response = await api.get(`/reservations/${hotelId}`);
  return response.data;
};

export const createReservation = async (hotelId, reservationData) => {
  const response = await api.post(`/reservations/${hotelId}`, reservationData);
  return response.data;
};
export const deleteRoom = async (hotelId, roomId) => {
  const response = await api.delete(`/rooms/${hotelId}/${roomId}`);
  return response.data;
};

export const updateRoom = async (hotelId, roomId, roomData) => {
  const response = await api.put(`/rooms/${hotelId}/${roomId}`, roomData);
  return response.data;
};