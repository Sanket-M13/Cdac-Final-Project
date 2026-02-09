# 🚗⚡ EV Charger Finder - Complete Charging Station Management System

A comprehensive Electric Vehicle charging station management platform with dual backend support (.NET & Spring Boot) and modern React frontend.

## 🌟 Features

### 👤 **User Features**
- **Station Discovery** - Find nearby charging stations with real-time availability
- **Smart Booking** - Book charging slots with time selection and payment integration
- **Vehicle Management** - Save multiple vehicle profiles with charging preferences
- **Reservation Management** - View, modify, and cancel bookings with 20-minute policy
- **Review System** - Rate and review charging stations
- **Google OAuth** - Quick login with Google account

### 🏢 **Station Master Features**
- **Station Management** - Add and manage charging stations
- **Booking Analytics** - Track station performance and revenue
- **Real-time Monitoring** - View active bookings and slot availability
- **Review Management** - Monitor customer feedback

### 👨‍💼 **Admin Features**
- **Complete Dashboard** - System-wide analytics and statistics
- **User Management** - Manage all platform users
- **Station Approval** - Approve/reject new charging stations
- **Booking Oversight** - Monitor and manage all bookings
- **Revenue Tracking** - Financial analytics and reporting

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive UI components
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **Google OAuth** - Authentication integration
- **Razorpay** - Payment gateway integration

### **Backend Options**

#### **Option 1: .NET Core 8**
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **JWT Authentication** - Secure token-based auth
- **SQL Server** - Primary database
- **Swagger** - API documentation

#### **Option 2: Spring Boot 3**
- **Spring Boot** - Java web framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **MySQL/PostgreSQL** - Database options
- **OpenAPI 3** - API documentation

### **Database Schema**
```sql
Users (Id, Name, Email, Password, Role, VehicleInfo, CreatedAt)
Stations (Id, Name, Address, Location, Pricing, Slots, OwnerId, Status)
Bookings (Id, UserId, StationId, DateTime, Amount, Status, PaymentId)
Reviews (Id, UserId, StationId, Rating, Comment, CreatedAt)
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- .NET 8 SDK OR Java 17+ with Maven
- SQL Server OR MySQL/PostgreSQL
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/ev-charger-finder.git
cd ev-charger-finder
```

### **2. Frontend Setup**
```bash
cd frontend-both
npm install
npm run dev
# Runs on http://localhost:5173
```

### **3A. .NET Backend Setup**
```bash
cd EVChargerAPI
dotnet restore
dotnet ef database update
dotnet run
# Runs on http://localhost:5000
```

### **3B. Spring Boot Backend Setup**
```bash
cd EVChargerSpringBoot
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

### **4. Environment Configuration**

#### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY=your_razorpay_key
```

#### **.NET (appsettings.json)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EVChargerDB;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your_jwt_secret_key",
    "Issuer": "EVChargerAPI",
    "Audience": "EVChargerUsers"
  }
}
```

#### **Spring Boot (application.yml)**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/evcharger
    username: your_db_username
    password: your_db_password
  jpa:
    hibernate:
      ddl-auto: update
jwt:
  secret: your_jwt_secret_key
  expiration: 86400000
```

## 📱 Application Flow

### **User Journey**
1. **Registration/Login** → Google OAuth or email/password
2. **Station Discovery** → Browse available charging stations
3. **Booking Process** → Select time slot, vehicle, and payment
4. **Payment** → Secure Razorpay integration
5. **Confirmation** → Booking confirmed with details
6. **Management** → View, cancel, or review bookings

### **Station Master Journey**
1. **Station Registration** → Add charging station details
2. **Approval Process** → Admin reviews and approves
3. **Booking Management** → Monitor station bookings
4. **Analytics** → Track performance and revenue

### **Admin Journey**
1. **Dashboard Overview** → System-wide statistics
2. **User Management** → Manage platform users
3. **Station Approval** → Review new station applications
4. **System Monitoring** → Oversee all operations

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth login

### **Stations**
- `GET /api/stations` - Get all stations
- `POST /api/stations` - Create new station
- `GET /api/stations/{id}` - Get station details

### **Bookings**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `DELETE /api/bookings/{id}` - Cancel booking

### **Admin**
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/bookings` - All bookings

## 🎨 UI Features

- **Dark Theme** - Modern dark interface with accent colors
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Maps** - Station location visualization
- **Real-time Updates** - Live booking status updates
- **Professional Modals** - Booking and review interfaces
- **Toast Notifications** - User feedback system

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access** - User, Station Master, Admin roles
- **Input Validation** - Frontend and backend validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin request handling

## 📊 Key Metrics

- **Real-time Slot Management** - Prevents overbooking
- **Payment Integration** - Secure Razorpay payments
- **Cancellation Policy** - 20-minute rule enforcement
- **Review System** - 5-star rating system
- **Analytics Dashboard** - Revenue and usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React.js with modern UI/UX
- **Backend Development** - .NET Core & Spring Boot APIs
- **Database Design** - Relational database architecture
- **Payment Integration** - Razorpay payment gateway
- **Authentication** - JWT & Google OAuth implementation

## 📞 Support

For support, email sanketmandavgane673@gmail.com.com or create an issue in this repository.

---

**⚡ Powering the future of electric vehicle charging! 🚗**
