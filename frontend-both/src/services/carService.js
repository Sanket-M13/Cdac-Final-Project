import { mockStorage, initializeMockData } from './mockDataService'
import { getCarRange } from '../utils/carData'


initializeMockData()

export const carService = {
  getUserCars: async () => {
  
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const currentUser = mockStorage.getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }
    
  
    const allCars = JSON.parse(localStorage.getItem('user_cars') || '[]')
    const userCars = allCars.filter(car => car.userId === currentUser.id)
    
    return { cars: userCars }
  },

  addCar: async (carData) => {

    await new Promise(resolve => setTimeout(resolve, 500))
    
    const currentUser = mockStorage.getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }
    
    const allCars = JSON.parse(localStorage.getItem('user_cars') || '[]')
    const newCar = {
      id: Math.max(...allCars.map(c => c.id), 0) + 1,
      userId: currentUser.id,
      ...carData,
      createdAt: new Date().toISOString()
    }
    
    allCars.push(newCar)
    localStorage.setItem('user_cars', JSON.stringify(allCars))
    
    return { car: newCar }
  },

  updateCar: async (id, carData) => {

    await new Promise(resolve => setTimeout(resolve, 500))
    
    const allCars = JSON.parse(localStorage.getItem('user_cars') || '[]')
    const index = allCars.findIndex(c => c.id === parseInt(id))
    
    if (index === -1) {
      throw new Error('Car not found')
    }
    
    allCars[index] = { ...allCars[index], ...carData, updatedAt: new Date().toISOString() }
    localStorage.setItem('user_cars', JSON.stringify(allCars))
    
    return { car: allCars[index] }
  },

  updateLocation: async (latitude, longitude) => {

    await new Promise(resolve => setTimeout(resolve, 200))
    
 
    const location = { latitude, longitude, timestamp: new Date().toISOString() }
    localStorage.setItem('user_location', JSON.stringify(location))
    
    return { location }
  },

  getNearbyStations: async () => {

    await new Promise(resolve => setTimeout(resolve, 300))
    
    const stations = mockStorage.getStations()
    const userLocation = JSON.parse(localStorage.getItem('user_location') || 'null')
    
    if (!userLocation) {
      return { stations }
    }
    
    
    const stationsWithDistance = stations.map(station => ({
      ...station,
      distance: calculateDistance(
        userLocation.latitude, userLocation.longitude,
        station.latitude, station.longitude
      )
    })).sort((a, b) => a.distance - b.distance)
    
    return { stations: stationsWithDistance }
  },

  calculateRange: (batteryPercentage, maxRange) => {
    return Math.round((batteryPercentage / 100) * maxRange)
  },

  canReachStation: (currentRange, distance) => {
    return currentRange >= distance * 1.2 // 20% buffer
  }
}


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}