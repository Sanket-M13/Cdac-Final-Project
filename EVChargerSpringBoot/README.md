# EV Charger Finder - Spring Boot Backend

Complete EV Charger Finder backend application converted from .NET to Spring Boot with Java.

## Project Structure

```
EVChargerSpringBoot/
├── src/
│   ├── main/
│   │   ├── java/com/evcharger/api/
│   │   │   ├── controller/          # REST Controllers
│   │   │   ├── service/             # Business Logic Services
│   │   │   ├── repository/          # Data Access Layer
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── security/            # JWT Security Components
│   │   │   ├── config/              # Configuration Classes
│   │   │   ├── exception/           # Global Exception Handler
│   │   │   └── EVChargerApiApplication.java
│   │   └── resources/
│   │       └── application.yml      # Configuration
│   └── test/                        # Test Classes
├── pom.xml                          # Maven Dependencies
├── start-springboot-backend.bat     # Startup Script
└── README.md
```

## Features

### Backend Features
- **JWT Authentication** - Secure token-based authentication
- **Spring Data JPA** - Database operations with SQL Server
- **RESTful APIs** - Complete CRUD operations for all entities
- **CORS Configuration** - Enabled for frontend integration
- **Swagger Documentation** - Interactive API documentation
- **Global Exception Handling** - Consistent error responses
- **Input Validation** - Hibernate Validator integration
- **Security** - Spring Security with role-based access
- **Logging** - SLF4J with Logback

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Stations
- `GET /api/stations` - Get all stations
- `GET /api/stations/{id}` - Get station by ID
- `POST /api/stations` - Create station (Admin)
- `PUT /api/stations/{id}` - Update station (Admin)
- `DELETE /api/stations/{id}` - Delete station (Admin)
- `GET /api/stations/nearby` - Get nearby stations

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/admin` - Get all bookings (Admin)
- `POST /api/bookings/admin-cancel` - Cancel booking (Admin)

#### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

#### Vehicles
- `GET /api/vehicles/brands` - Get all vehicle brands
- `GET /api/vehicles/brands/{type}` - Get brands by type
- `GET /api/vehicles/brands/{brandId}/models` - Get models by brand
- `POST /api/vehicles/user-vehicle` - Save user vehicle
- `GET /api/vehicles/user-vehicle` - Get user vehicle

## Technology Stack

- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM framework
- **SQL Server** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **Swagger/OpenAPI 3** - API documentation
- **SLF4J/Logback** - Logging
- **Jackson** - JSON processing
- **Hibernate Validator** - Input validation

## Database Configuration

The application uses SQL Server with the following default configuration:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=EVChargerDB_New;trustServerCertificate=true
    username: sa
    password: 
```

### Database Setup
1. Install SQL Server or SQL Server Express
2. Create database `EVChargerDB_New`
3. Update connection string in `application.yml` if needed
4. The application will auto-create tables and seed initial data

## Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- SQL Server (LocalDB, Express, or Full)

### 1. Start Backend

#### Option 1: Use the batch file
```bash
start-springboot-backend.bat
```

#### Option 2: Manual start
```bash
cd EVChargerSpringBoot
mvn clean compile
mvn spring-boot:run
```

### 2. Access Application
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger-ui.html
- **API Docs**: http://localhost:5000/api-docs

### 3. Frontend Integration
The backend is configured to work with the existing React frontend:
- CORS enabled for `http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`
- All API contracts maintained for seamless integration

## Default Credentials

- **Admin**: admin@evcharger.com / Admin123!
- **Regular users**: Any email/password combination will work for demo

## API Configuration

The backend runs on port 5000 by default and provides the same API contracts as the original .NET version:

```yaml
server:
  port: 5000

cors:
  allowed-origins:
    - http://localhost:5173
    - http://localhost:5174
    - http://localhost:3000
```

## Security Features

- **JWT Authentication** with 7-day expiration
- **Password Encryption** using BCrypt
- **Role-based Access Control** (User/Admin)
- **CORS Protection** with specific origin allowlist
- **Input Validation** on all endpoints
- **SQL Injection Protection** via JPA/Hibernate

## Development Features

- **Hot Reload** with Spring Boot DevTools
- **Database Migration** with Hibernate DDL auto-update
- **Comprehensive Logging** for debugging
- **Exception Handling** with detailed error responses
- **API Documentation** with Swagger UI
- **Data Seeding** with initial test data

## Production Considerations

1. **Database**: Update connection string for production database
2. **JWT Secret**: Change the JWT secret key in production
3. **CORS**: Update allowed origins for production frontend URLs
4. **Logging**: Configure appropriate log levels
5. **SSL**: Enable HTTPS in production
6. **Database Migration**: Use Flyway or Liquibase for production migrations

## API Compatibility

This Spring Boot backend maintains 100% API compatibility with the original .NET backend:
- Same endpoint URLs and HTTP methods
- Same request/response JSON structures
- Same authentication mechanism (JWT)
- Same business logic and validation rules
- Same database schema and relationships

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - Change port in `application.yml`: `server.port: 8080`

2. **Database connection failed**
   - Verify SQL Server is running
   - Check connection string in `application.yml`
   - Ensure database exists

3. **JWT token issues**
   - Check JWT secret key configuration
   - Verify token expiration settings

4. **CORS errors**
   - Add your frontend URL to allowed origins in `application.yml`

### Logs
Check application logs for detailed error information:
```bash
mvn spring-boot:run
```

## Contributing

1. Follow Spring Boot best practices
2. Maintain API compatibility with frontend
3. Add appropriate tests for new features
4. Update documentation for any changes

## License

This project is licensed under the MIT License.