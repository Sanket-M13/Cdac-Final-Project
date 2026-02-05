USE ev_charger_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stations table
CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  chargerType VARCHAR(50) NOT NULL,
  chargingPower VARCHAR(20) NOT NULL,
  pricePerHour DECIMAL(10, 2) NOT NULL,
  totalSlots INT DEFAULT 4,
  availableSlots INT DEFAULT 4,
  isAvailable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  stationId INT NOT NULL,
  vehicleNumber VARCHAR(20) NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  currentPercentage INT NOT NULL,
  targetPercentage INT NOT NULL,
  totalAmount DECIMAL(10, 2) NOT NULL,
  paymentId VARCHAR(255),
  status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  stationId INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (password is 'password' for all except Sanket who has 'Sanket123')
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Sanket', 'sanket@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdCJjC5VGX6oQy6L8zJ8J8J8J8J8J', 'user');

-- Insert sample stations
INSERT INTO stations (name, address, latitude, longitude, chargerType, chargingPower, pricePerHour, totalSlots, availableSlots) VALUES 
('Central Mall EV Hub', 'Connaught Place, New Delhi', 28.6315, 77.2167, 'DC Fast Charger', '50kW', 150.00, 4, 2),
('Metro Station Charger', 'Rajiv Chowk Metro Station, Delhi', 28.6328, 77.2197, 'AC Charger', '22kW', 80.00, 6, 4),
('Airport Express Charging', 'IGI Airport, Delhi', 28.5562, 77.1000, 'Supercharger', '120kW', 200.00, 8, 6),
('Shopping Complex Hub', 'Select City Walk, Saket', 28.5245, 77.2066, 'DC Fast Charger', '75kW', 175.00, 5, 3),
('Tech Park Station', 'Cyber City, Gurgaon', 28.4595, 77.0266, 'AC Charger', '11kW', 60.00, 10, 8);

-- Insert sample reviews
INSERT INTO reviews (userId, stationId, rating, comment) VALUES 
(2, 1, 5, 'Excellent charging station with fast service!'),
(3, 1, 4, 'Good location but can be crowded during peak hours.'),
(2, 2, 4, 'Convenient metro station location.'),
(3, 3, 5, 'Perfect for airport travelers, very reliable.');

-- Insert sample bookings
INSERT INTO bookings (userId, stationId, vehicleNumber, startTime, endTime, currentPercentage, targetPercentage, totalAmount, status) VALUES 
(2, 1, 'DL01AB1234', '2024-01-15 10:00:00', '2024-01-15 12:00:00', 20, 80, 300.00, 'completed'),
(3, 2, 'DL02CD5678', '2024-01-16 14:00:00', '2024-01-16 16:30:00', 15, 90, 200.00, 'completed');