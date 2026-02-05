package com.evcharger.api.service;

import com.evcharger.api.dto.StationDto;
import com.evcharger.api.entity.Station;
import com.evcharger.api.repository.StationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StationService {
    private static final Logger logger = LoggerFactory.getLogger(StationService.class);

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.evcharger.api.repository.UserRepository userRepository;

    public List<StationDto> getAllStations() {
        try {
            List<Station> stations = stationRepository.findAll(); // Use findAll instead of findAllWithStationMaster
            return stations.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all stations: {}", e.getMessage());
            return List.of(); // Return empty list on error
        }
    }

    public List<StationDto> getApprovedStations() {
        List<Station> stations = stationRepository.findAllWithStationMaster();
        return stations.stream()
                .filter(station -> "Approved".equals(station.getApprovalStatus()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<StationDto> getStationById(Long id) {
        return stationRepository.findById(id)
                .map(this::convertToDto);
    }

    public StationDto createStation(StationDto stationDto) {
        Station station = convertToEntity(stationDto);
        Station savedStation = stationRepository.save(station);
        return convertToDto(savedStation);
    }

    public Optional<StationDto> updateStation(Long id, StationDto stationDto) {
        return stationRepository.findById(id)
                .map(existingStation -> {
                    updateStationFromDto(existingStation, stationDto);
                    Station savedStation = stationRepository.save(existingStation);
                    return convertToDto(savedStation);
                });
    }

    public boolean deleteStation(Long id) {
        if (stationRepository.existsById(id)) {
            stationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<StationDto> getNearbyStations(double lat, double lng, double range) {
        List<Station> availableStations = stationRepository.findByStatus("Available");
        
        return availableStations.stream()
                .filter(station -> "Approved".equals(station.getApprovalStatus())) // Only approved stations
                .filter(station -> {
                    double distance = calculateDistance(lat, lng, station.getLatitude(), station.getLongitude());
                    return distance <= range;
                })
                .sorted((s1, s2) -> {
                    double dist1 = calculateDistance(lat, lng, s1.getLatitude(), s1.getLongitude());
                    double dist2 = calculateDistance(lat, lng, s2.getLatitude(), s2.getLongitude());
                    int distanceComparison = Double.compare(dist1, dist2);
                    if (distanceComparison != 0) return distanceComparison;
                    return Integer.compare(s2.getAvailableSlots(), s1.getAvailableSlots());
                })
                .map(station -> {
                    StationDto dto = convertToDto(station);
                    dto.setDistance(calculateDistance(lat, lng, station.getLatitude(), station.getLongitude()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371; // Earth's radius in kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Station Master specific methods
    public List<StationDto> getStationsByMaster(Long stationMasterId) {
        List<Station> stations = stationRepository.findByStationMasterId(stationMasterId);
        return stations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public StationDto createStationForMaster(StationDto stationDto, Long stationMasterId) {
        Station station = convertToEntity(stationDto);
        station.setStationMaster(userRepository.findById(stationMasterId).orElse(null));
        station.setApprovalStatus("Pending"); // Set default approval status
        Station savedStation = stationRepository.save(station);
        return convertToDto(savedStation);
    }

    public StationDto updateStationForMaster(Long stationId, StationDto stationDto, Long stationMasterId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        
        if (!station.getStationMaster().getId().equals(stationMasterId)) {
            throw new RuntimeException("Unauthorized: Station does not belong to this station master");
        }
        
        updateStationFromDto(station, stationDto);
        station.setApprovalStatus("Pending"); // Reset to pending after edit
        Station savedStation = stationRepository.save(station);
        return convertToDto(savedStation);
    }

    public void updateStationStatus(Long stationId, String status, Long stationMasterId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        
        if (!station.getStationMaster().getId().equals(stationMasterId)) {
            throw new RuntimeException("Unauthorized: Station does not belong to this station master");
        }
        
        station.setStatus(status);
        stationRepository.save(station);
    }

    public void updateApprovalStatus(Long stationId, String approvalStatus) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        
        station.setApprovalStatus(approvalStatus);
        stationRepository.save(station);
    }

    public List<StationDto> getStationsByApprovalStatus(String approvalStatus) {
        List<Station> stations = stationRepository.findByApprovalStatus(approvalStatus);
        return stations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void updateStationApprovalStatus(Long stationId, String approvalStatus) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        
        station.setApprovalStatus(approvalStatus);
        stationRepository.save(station);
    }

    private StationDto convertToDto(Station station) {
        StationDto dto = new StationDto();
        dto.setId(station.getId());
        dto.setName(station.getName());
        dto.setAddress(station.getAddress());
        dto.setLatitude(station.getLatitude());
        dto.setLongitude(station.getLongitude());
        dto.setConnectorTypes(parseJsonArray(station.getConnectorTypes()));
        dto.setPowerOutput(station.getPowerOutput());
        dto.setPricePerKwh(station.getPricePerKwh());
        dto.setAmenities(parseJsonArray(station.getAmenities()));
        dto.setOperatingHours(station.getOperatingHours());
        dto.setStatus(station.getStatus());
        dto.setTotalSlots(station.getTotalSlots());
        dto.setAvailableSlots(station.getAvailableSlots());
        dto.setApprovalStatus(station.getApprovalStatus());
        dto.setOwnerName(station.getStationMaster() != null ? station.getStationMaster().getName() : null);
        return dto;
    }

    private Station convertToEntity(StationDto dto) {
        Station station = new Station();
        updateStationFromDto(station, dto);
        return station;
    }

    private void updateStationFromDto(Station station, StationDto dto) {
        station.setName(dto.getName());
        station.setAddress(dto.getAddress());
        station.setLatitude(dto.getLatitude());
        station.setLongitude(dto.getLongitude());
        station.setConnectorTypes(serializeJsonArray(dto.getConnectorTypes()));
        station.setPowerOutput(dto.getPowerOutput());
        station.setPricePerKwh(dto.getPricePerKwh());
        station.setAmenities(serializeJsonArray(dto.getAmenities()));
        station.setOperatingHours(dto.getOperatingHours());
        station.setStatus(dto.getStatus());
        station.setTotalSlots(dto.getTotalSlots());
        station.setAvailableSlots(dto.getAvailableSlots());
    }

    private String[] parseJsonArray(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return new String[0];
        }
        try {
            return objectMapper.readValue(jsonString, String[].class);
        } catch (JsonProcessingException e) {
            logger.error("Error parsing JSON array: {}", e.getMessage());
            return new String[0];
        }
    }

    private String serializeJsonArray(String[] array) {
        if (array == null || array.length == 0) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(array);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing JSON array: {}", e.getMessage());
            return "[]";
        }
    }
}