// UI Constants
export const UI_CONSTANTS = {
  // Theme colors
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#10B981',
    SUCCESS: '#059669',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  },
  
  // Animation durations
  ANIMATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
  }
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 17.6868,
    lng: 74.0180
  },
  DEFAULT_ZOOM: 13,
  MAX_ZOOM: 18,
  MIN_ZOOM: 8
};

// Charging Station Types
export const CONNECTOR_TYPES = {
  TYPE_2: 'Type 2',
  CCS: 'CCS',
  CHADEMO: 'CHAdeMO',
  TYPE_1: 'Type 1'
};

export const POWER_OUTPUTS = {
  SLOW: '7kW',
  FAST: '22kW',
  RAPID: '50kW',
  ULTRA_RAPID: '150kW'
};

// Car Brands and Models (moved from utils)
export const CAR_BRANDS = {
  TESLA: 'Tesla',
  BMW: 'BMW',
  AUDI: 'Audi',
  MERCEDES: 'Mercedes-Benz',
  TATA: 'Tata',
  MG: 'MG',
  HYUNDAI: 'Hyundai'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  VEHICLE_NUMBER: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/
};

// Date and Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
  SAVED_LOCATIONS: 'savedLocations'
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  STATIONS: '/stations',
  BOOKINGS: '/bookings',
  PROFILE: '/profile',
  ADMIN: '/admin',
  NOT_FOUND: '/404'
};