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

export const stationService = {
  getAllStations: async () => {
    const response = await api.get(API_ENDPOINTS.STATIONS.BASE)
    return response.data
  },

  getStationById: async (id) => {
    const response = await api.get(API_ENDPOINTS.STATIONS.BY_ID(id))
    return response.data
  },

  createStation: async (stationData) => {
    const response = await api.post(API_ENDPOINTS.STATIONS.BASE, stationData)
    return response.data
  },

  updateStation: async (id, stationData) => {
    const response = await api.put(`${API_ENDPOINTS.STATIONS.BASE}/${id}`, stationData)
    return response.data
  },

  deleteStation: async (id) => {
    const response = await api.delete(`${API_ENDPOINTS.STATIONS.BASE}/${id}`)
    return response.data
  }
}