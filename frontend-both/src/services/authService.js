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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  },

  signup: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response.data
  },

  googleLogin: async (googleToken) => {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { token: googleToken })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME)
    return response.data
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  }
}