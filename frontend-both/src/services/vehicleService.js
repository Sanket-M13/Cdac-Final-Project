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

export const vehicleService = {

  getBrands: async () => {
    const response = await api.get('/vehicles/brands')
    return response.data
  },


  getModels: async (brandId) => {
    const response = await api.get(`/vehicles/brands/${brandId}/models`)
    return response.data
  },


  saveUserVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles/user-vehicle', vehicleData)
    return response.data
  },


  getUserVehicle: async () => {
    const response = await api.get('/vehicles/user-vehicle')
    return response.data
  },

 
  getStationsInRange: async (latitude, longitude, rangeKm) => {
    const response = await api.get(`/stations/nearby?lat=${latitude}&lng=${longitude}&range=${rangeKm}`)
    return response.data
  }
}