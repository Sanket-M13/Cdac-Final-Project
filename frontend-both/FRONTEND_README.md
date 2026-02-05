# EV Charger Finder - Frontend Only

This application now runs entirely in the frontend without requiring a backend server. All data is stored locally using localStorage and mock services simulate API functionality.

## Features

- **Authentication**: Mock login/signup system with localStorage
- **Station Management**: View and manage charging stations
- **Booking System**: Book charging slots with mock payment processing
- **User Dashboard**: Manage profile and view bookings
- **Admin Panel**: Admin features for managing users, stations, and bookings
- **Car Management**: Add and manage your electric vehicles
- **Reviews**: Leave reviews for charging stations

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser and go to `http://localhost:5173`
   - The app will automatically initialize with sample data

## Default Login Credentials

### Admin Access
- **Email**: `admin@example.com`
- **Password**: Any password (mock authentication)

### Regular User
- **Email**: Any email address
- **Password**: Any password (mock authentication)

*Note: The system will automatically create a user account if the email doesn't exist.*

## Mock Data

The application comes pre-loaded with:
- 3 sample charging stations in Satara
- Sample car data for various EV models
- Mock payment processing (90% success rate)

## Data Storage

All data is stored in your browser's localStorage:
- User accounts and authentication
- Charging stations
- Bookings and reservations
- Reviews and ratings
- Car profiles

## Key Changes Made

1. **Removed Backend Dependency**: All API calls now use mock services
2. **Local Storage**: Data persists in browser localStorage
3. **Mock Authentication**: JWT-like tokens generated locally
4. **Simulated API Delays**: Realistic loading states maintained
5. **Mock Payment**: Razorpay integration replaced with mock processing

## File Structure

```
src/
├── services/
│   ├── mockDataService.js     # Core mock data and storage
│   ├── authService.js         # Authentication (mock)
│   ├── stationService.js      # Station management (mock)
│   ├── bookingService.js      # Booking system (mock)
│   ├── userService.js         # User management (mock)
│   ├── reviewService.js       # Reviews system (mock)
│   ├── adminService.js        # Admin features (mock)
│   ├── paymentService.js      # Payment processing (mock)
│   ├── carService.js          # Car management (mock)
│   └── vehicleService.js      # Vehicle utilities
├── components/                # React components
├── pages/                     # Page components
├── context/                   # React context providers
└── utils/                     # Utility functions
```

## Development Notes

- All services maintain the same API interface as the original backend
- Error handling and loading states are preserved
- Data validation occurs on the frontend
- Mock delays simulate real API response times

## Deployment

Since this is now a pure frontend application, you can deploy it to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Simply run `npm run build` and deploy the `dist` folder.