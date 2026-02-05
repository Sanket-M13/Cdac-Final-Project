import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants/apiConstants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS.BASE, bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.USER);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.BY_ID(id));
    return response.data;
  },

  cancelBooking: async (id, message = 'Cancelled by user') => {
    const response = await api.delete(API_ENDPOINTS.BOOKINGS.CANCEL(id));
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.ADMIN);
    return response.data;
  }
};