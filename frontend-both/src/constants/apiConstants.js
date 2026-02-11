// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://evcharger-springboot.onrender.com/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};


export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    GOOGLE: '/auth/google'
  },
  

  STATIONS: {
    BASE: '/stations',
    BY_ID: (id) => `/stations/${id}`,
    NEARBY: '/stations/nearby',
    SEARCH: '/stations/search'
  },
  

  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id) => `/bookings/${id}`,
    USER: '/bookings/user',
    ADMIN: '/bookings/admin',
    CANCEL: (id) => `/bookings/${id}`,
    ADMIN_CANCEL: '/bookings/admin-cancel'
  },

  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile',
    PASSWORD: (id) => `/users/${id}/password`
  },
  

  REVIEWS: {
    BASE: '/reviews',
    BY_STATION: (stationId) => `/reviews/station/${stationId}`,
    ADMIN: '/reviews/admin'
  },
  

  ADMIN: {
    DASHBOARD: '/admin/dashboard-stats',
    USERS: '/admin/users',
    BOOKINGS: '/admin/bookings',
    REVIEWS: '/admin/reviews',
    ANALYTICS: '/admin/station-analytics'
  },
  

  CARS: {
    BASE: '/cars',
    USER: '/cars/user',
    BY_ID: (id) => `/cars/${id}`
  },
  

  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    VERIFY: '/payment/verify'
  },


  VEHICLES: {
    BRANDS: '/vehicles/brands',
    MODELS: (brandId) => `/vehicles/brands/${brandId}/models`,
    USER_VEHICLE: '/vehicles/user-vehicle'
  }
};


export const APP_CONSTANTS = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  REFRESH_TOKEN_KEY: 'refreshToken',
  

  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  

  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  

  BOOKING_STATUS: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed'
  },
  

  STATION_STATUS: {
    AVAILABLE: 'Available',
    OCCUPIED: 'Occupied',
    MAINTENANCE: 'Maintenance',
    OFFLINE: 'Offline'
  },
  

  USER_ROLES: {
    ADMIN: 'Admin',
    USER: 'User'
  }
};


export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.'
};


export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  BOOKING_SUCCESS: 'Booking created successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!'
};