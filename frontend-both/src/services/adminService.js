import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS } from '../constants/apiConstants'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminService = {
 
  getDashboardStats: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD)
    return response.data
  },


  getAllUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS)
    return { users: response.data }
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status })
    return response.data
  },

  
  getAllBookings: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.BOOKINGS)
    return { bookings: response.data }
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/admin/bookings/${bookingId}/status`, { status })
    return response.data
  },

  cancelBooking: async (bookingId, message) => {
    const response = await api.post('/bookings/admin-cancel', { bookingId, message })
    return response.data
  },


  getAllReviews: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.REVIEWS)
    return { reviews: response.data }
  },

  getAllQueries: async () => {
  
    return { queries: [] }
  },

  respondToQuery: async (queryId, response) => {
    return { message: 'Response sent successfully' }
  },

  // Station analytics
  getStationAnalytics: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.ANALYTICS)
    return { analytics: response.data }
  }
}