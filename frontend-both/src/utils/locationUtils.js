export const sampleStations = [
  {
    id: 1,
    name: "Central Mall EV Hub",
    address: "Connaught Place, New Delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    chargerType: "DC Fast Charger",
    pricePerHour: 150,
    isAvailable: true,
    totalSlots: 4,
    availableSlots: 2,
    chargingPower: "50kW"
  },
  {
    id: 2,
    name: "Metro Station Charger",
    address: "Rajiv Chowk Metro Station, Delhi",
    latitude: 28.6328,
    longitude: 77.2197,
    chargerType: "AC Charger",
    pricePerHour: 80,
    isAvailable: true,
    totalSlots: 6,
    availableSlots: 4,
    chargingPower: "22kW"
  },
  {
    id: 3,
    name: "Airport Express Charging",
    address: "IGI Airport, Delhi",
    latitude: 28.5562,
    longitude: 77.1000,
    chargerType: "Supercharger",
    pricePerHour: 200,
    isAvailable: false,
    totalSlots: 8,
    availableSlots: 0,
    chargingPower: "120kW"
  },
  {
    id: 4,
    name: "Shopping Complex Hub",
    address: "Karol Bagh, New Delhi",
    latitude: 28.6519,
    longitude: 77.1909,
    chargerType: "DC Fast Charger",
    pricePerHour: 120,
    isAvailable: true,
    totalSlots: 3,
    availableSlots: 1,
    chargingPower: "60kW"
  },
  {
    id: 5,
    name: "Tech Park Charging Station",
    address: "Cyber City, Gurgaon",
    latitude: 28.4595,
    longitude: 77.0266,
    chargerType: "AC Charger",
    pricePerHour: 100,
    isAvailable: true,
    totalSlots: 10,
    availableSlots: 7,
    chargingPower: "22kW"
  }
]

export const locationService = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      )
    })
  },

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  },

  findNearestStations: (userLocation, stations, limit = 3) => {
    return stations
      .map(station => ({
        ...station,
        distance: locationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          station.latitude,
          station.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
  }
}

export const chargingCalculator = {
  calculateChargingTime: (currentPercentage, targetPercentage, chargingPower) => {
    const batteryCapacity = 60
    const percentageDiff = targetPercentage - currentPercentage
    const energyNeeded = (percentageDiff / 100) * batteryCapacity
    
    let chargingSpeed
    switch(chargingPower) {
      case '22kW': chargingSpeed = 22; break
      case '50kW': chargingSpeed = 50; break
      case '60kW': chargingSpeed = 60; break
      case '120kW': chargingSpeed = 120; break
      default: chargingSpeed = 22
    }
    
    const timeInHours = energyNeeded / chargingSpeed
    const hours = Math.floor(timeInHours)
    const minutes = Math.round((timeInHours - hours) * 60)
    
    return { hours, minutes, totalMinutes: Math.round(timeInHours * 60) }
  },

  generateTimeSlots: (chargingTime) => {
    const slots = []
    const now = new Date()
    const startHour = now.getHours() + 1
    
    for (let i = 0; i < 12; i++) {
      const slotStart = new Date()
      slotStart.setHours(startHour + i, 0, 0, 0)
      
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + chargingTime.totalMinutes)
      
      slots.push({
        id: i + 1,
        startTime: slotStart.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        endTime: slotEnd.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        isAvailable: Math.random() > 0.3,
        duration: chargingTime.totalMinutes
      })
    }
    
    return slots
  }
}