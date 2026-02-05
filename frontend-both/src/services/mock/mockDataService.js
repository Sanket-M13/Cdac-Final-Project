// Mock data service to replace backend functionality
export const mockData = {
  stations: [
    {
      id: 1,
      name: "Central Mall Charging Hub",
      address: "123 Main Street, Satara",
      latitude: 17.6868,
      longitude: 74.0180,
      connectorTypes: ["Type 2", "CCS"],
      powerOutput: "50kW",
      pricePerKwh: 8.5,
      amenities: ["Parking", "Restroom", "Cafe"],
      operatingHours: "24/7",
      status: "Available",
      totalSlots: 4,
      availableSlots: 2
    },
    {
      id: 2,
      name: "Tech Park Fast Charger",
      address: "456 Tech Avenue, Satara",
      latitude: 17.6950,
      longitude: 74.0250,
      connectorTypes: ["CCS", "CHAdeMO"],
      powerOutput: "150kW",
      pricePerKwh: 12.0,
      amenities: ["Parking", "Security"],
      operatingHours: "6:00 AM - 10:00 PM",
      status: "Available",
      totalSlots: 6,
      availableSlots: 4
    },
    {
      id: 3,
      name: "Highway Service Station",
      address: "789 Highway Road, Satara",
      latitude: 17.6750,
      longitude: 74.0100,
      connectorTypes: ["Type 2", "CCS", "CHAdeMO"],
      powerOutput: "100kW",
      pricePerKwh: 10.0,
      amenities: ["Parking", "Restroom", "Food Court", "Fuel Station"],
      operatingHours: "24/7",
      status: "Available",
      totalSlots: 8,
      availableSlots: 6
    }
  ],
  
  users: [
    {
      id: 1,
      email: "admin@example.com",
      name: "Admin User",
      role: "Admin",
      phone: "9876543210"
    }
  ],
  
  bookings: [],
  
  reviews: []
};

// Local storage keys
const STORAGE_KEYS = {
  STATIONS: 'ev_stations',
  USERS: 'ev_users',
  BOOKINGS: 'ev_bookings',
  REVIEWS: 'ev_reviews',
  CURRENT_USER: 'ev_current_user',
  TOKEN: 'token'
};

// Initialize mock data in localStorage if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(mockData.stations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockData.users));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(mockData.bookings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockData.reviews));
  }
};

// Helper functions for localStorage operations
export const mockStorage = {
  getStations: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]'),
  setStations: (stations) => localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations)),
  
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  setUsers: (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getBookings: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'),
  setBookings: (bookings) => localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings)),
  
  getReviews: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]'),
  setReviews: (reviews) => localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),
  
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

// Generate mock JWT token
export const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    nameid: user.id,
    email: user.email,
    unique_name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const signature = btoa("mock_signature");
  return `${header}.${payload}.${signature}`;
};