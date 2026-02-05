package com.evcharger.api.config;

import com.evcharger.api.entity.*;
import com.evcharger.api.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleBrandRepository vehicleBrandRepository;

    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Initializing database with seed data...");

            // Create admin user if not exists
            if (!userRepository.existsByEmail("admin@evcharger.com")) {
                User adminUser = new User();
                adminUser.setEmail("admin@evcharger.com");
                adminUser.setName("Admin User");
                adminUser.setPasswordHash(passwordEncoder.encode("Admin123!"));
                adminUser.setRole("Admin");
                userRepository.save(adminUser);
                logger.info("Admin user created");
            }

            // Seed vehicle brands and models
            if (vehicleBrandRepository.count() == 0) {
                seedVehicleBrands();
                logger.info("Vehicle brands and models seeded");
            }

            // Seed stations
            if (stationRepository.count() == 0) {
                seedStations();
                logger.info("Stations seeded");
            }

            logger.info("Database initialization completed");
        } catch (Exception e) {
            logger.error("Error during database initialization: ", e);
        }
    }

    private void seedVehicleBrands() {
        List<VehicleBrand> carBrands = Arrays.asList(
            new VehicleBrand("Tata", "Car"),
            new VehicleBrand("Mahindra", "Car"),
            new VehicleBrand("MG", "Car"),
            new VehicleBrand("Hyundai", "Car"),
            new VehicleBrand("Kia", "Car"),
            new VehicleBrand("BYD", "Car"),
            new VehicleBrand("Ather", "Bike"),
            new VehicleBrand("Ola Electric", "Bike"),
            new VehicleBrand("TVS", "Bike"),
            new VehicleBrand("Bajaj", "Bike"),
            new VehicleBrand("Hero Electric", "Bike")
        );

        vehicleBrandRepository.saveAll(carBrands);

        // Add models
        List<VehicleModel> models = Arrays.asList(
            new VehicleModel("Nexon EV", 1L),
            new VehicleModel("Tigor EV", 1L),
            new VehicleModel("Tiago EV", 1L),
            new VehicleModel("XUV400", 2L),
            new VehicleModel("eVerito", 2L),
            new VehicleModel("ZS EV", 3L),
            new VehicleModel("Comet EV", 3L),
            new VehicleModel("Kona Electric", 4L),
            new VehicleModel("Ioniq 5", 4L),
            new VehicleModel("EV6", 5L),
            new VehicleModel("Atto 3", 6L),
            new VehicleModel("450X", 7L),
            new VehicleModel("450 Plus", 7L),
            new VehicleModel("S1 Pro", 8L),
            new VehicleModel("S1 Air", 8L),
            new VehicleModel("iQube", 9L),
            new VehicleModel("Chetak", 10L),
            new VehicleModel("Photon", 11L),
            new VehicleModel("Optima", 11L)
        );

        vehicleModelRepository.saveAll(models);
    }

    private void seedStations() {
        List<Station> stations = Arrays.asList(
            createStation("Central Mall Charging Hub", "123 Main Street, Satara", 17.6868, 74.0180, 
                "[\"Type 2\", \"CCS\"]", "50kW", new BigDecimal("8.5"), 
                "[\"Parking\", \"Restroom\", \"Cafe\"]", "24/7", 4, 0),
            
            createStation("Tech Park Fast Charger", "456 Tech Avenue, Satara", 17.6950, 74.0250,
                "[\"CCS\", \"CHAdeMO\"]", "150kW", new BigDecimal("12.0"),
                "[\"Parking\", \"Security\"]", "6:00 AM - 10:00 PM", 6, 4),
            
            createStation("Highway Express Charger", "789 Highway Road, Satara", 17.7000, 74.0300,
                "[\"Type 2\", \"CCS\", \"CHAdeMO\"]", "120kW", new BigDecimal("10.5"),
                "[\"Parking\", \"Restroom\", \"Food Court\"]", "24/7", 8, 6),
            
            createStation("City Center Quick Charge", "321 City Center, Satara", 17.6800, 74.0150,
                "[\"Type 2\", \"CCS\"]", "75kW", new BigDecimal("9.0"),
                "[\"Parking\", \"Shopping\"]", "8:00 AM - 11:00 PM", 3, 2),
            
            createStation("Green Energy Station", "654 Green Valley, Satara", 17.6750, 74.0100,
                "[\"Type 2\", \"CCS\"]", "60kW", new BigDecimal("7.5"),
                "[\"Parking\", \"Garden\", \"Restroom\"]", "6:00 AM - 9:00 PM", 5, 3),
            
            createStation("Airport Charging Plaza", "987 Airport Road, Satara", 17.7100, 74.0400,
                "[\"Type 2\", \"CCS\", \"CHAdeMO\"]", "180kW", new BigDecimal("15.0"),
                "[\"Parking\", \"Lounge\", \"WiFi\"]", "24/7", 10, 8),
            
            createStation("Residential Complex Charger", "147 Residential Area, Satara", 17.6900, 74.0200,
                "[\"Type 2\"]", "22kW", new BigDecimal("6.0"),
                "[\"Parking\", \"Security\"]", "24/7", 2, 1),
            
            createStation("Tata Power Super Charger Koregaon Park", "258 Koregaon Park, Pune", 18.5362, 73.8980,
                "[\"CCS\", \"CHAdeMO\"]", "200kW", new BigDecimal("14.0"),
                "[\"Parking\", \"Cafe\", \"WiFi\"]", "24/7", 12, 9),
            
            // Nanded Region Stations
            createStation("Nanded Railway Station Charging Hub", "Railway Station Road, Nanded, Maharashtra 431602", 19.1383, 77.3210,
                "[\"Type 2\", \"CCS\", \"CHAdeMO\"]", "120kW", new BigDecimal("11.0"),
                "[\"Parking\", \"Restroom\", \"Food Court\", \"WiFi\"]", "24/7", 8, 6),
            
            createStation("Mahur Road Fast Charger", "Mahur Road, Near MIDC, Nanded, Maharashtra 431603", 19.1520, 77.2980,
                "[\"CCS\", \"Type 2\"]", "60kW", new BigDecimal("9.5"),
                "[\"Parking\", \"Security\", \"Restroom\"]", "6:00 AM - 10:00 PM", 4, 3)
        );

        stationRepository.saveAll(stations);
    }

    private Station createStation(String name, String address, double lat, double lng, 
                                String connectorTypes, String powerOutput, BigDecimal pricePerKwh,
                                String amenities, String operatingHours, int totalSlots, int availableSlots) {
        Station station = new Station();
        station.setName(name);
        station.setAddress(address);
        station.setLatitude(lat);
        station.setLongitude(lng);
        station.setConnectorTypes(connectorTypes);
        station.setPowerOutput(powerOutput);
        station.setPricePerKwh(pricePerKwh);
        station.setAmenities(amenities);
        station.setOperatingHours(operatingHours);
        station.setStatus("Available");
        station.setTotalSlots(totalSlots);
        station.setAvailableSlots(availableSlots);
        return station;
    }
}