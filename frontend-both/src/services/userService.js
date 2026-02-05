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

export const userService = {
  getAllUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.BASE)
    return { users: response.data }
  },

  getUserById: async (id) => {
    const response = await api.get(API_ENDPOINTS.USERS.BY_ID(id))
    return { user: response.data }
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE)
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put(API_ENDPOINTS.USERS.PROFILE, userData)
    return response.data
  },

  updateUser: async (id, userData) => {
    const response = await api.put(API_ENDPOINTS.USERS.BY_ID(id), userData)
    return { user: response.data }
  },

  deleteUser: async (id) => {
    const response = await api.delete(API_ENDPOINTS.USERS.BY_ID(id))
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData)
    return response.data
  },

  updatePassword: async (id, passwordData) => {
    const response = await api.put(API_ENDPOINTS.USERS.PASSWORD(id), passwordData)
    return response.data
  }
}