package com.evcharger.api.controller;

import com.evcharger.api.dto.StationDto;
import com.evcharger.api.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stations")
@Tag(name = "Stations", description = "EV charging station management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class StationsController {

    @Autowired
    private StationService stationService;

    @GetMapping
    @Operation(summary = "Get all stations", description = "Retrieve all EV charging stations for admin management")
    public ResponseEntity<?> getStations() {
        List<StationDto> stations = stationService.getAllStations();
        return ResponseEntity.ok(Map.of("stations", stations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get station by ID", description = "Retrieve a specific EV charging station by ID")
    public ResponseEntity<?> getStation(@PathVariable Long id) {
        Optional<StationDto> station = stationService.getStationById(id);
        if (station.isPresent()) {
            return ResponseEntity.ok(Map.of("station", station.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Create station", description = "Create a new EV charging station")
    public ResponseEntity<?> createStation(@Valid @RequestBody StationDto stationDto) {
        StationDto createdStation = stationService.createStation(stationDto);
        return ResponseEntity.ok(Map.of("station", Map.of("id", createdStation.getId(), "name", createdStation.getName())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update station", description = "Update an existing EV charging station")
    public ResponseEntity<?> updateStation(@PathVariable Long id, @Valid @RequestBody StationDto stationDto) {
        Optional<StationDto> updatedStation = stationService.updateStation(id, stationDto);
        if (updatedStation.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Station updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete station", description = "Delete an EV charging station")
    public ResponseEntity<?> deleteStation(@PathVariable Long id) {
        boolean deleted = stationService.deleteStation(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Station deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby stations", description = "Find EV charging stations within specified range")
    public ResponseEntity<?> getNearbyStations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double range) {
        
        List<StationDto> nearbyStations = stationService.getNearbyStations(lat, lng, range);
        return ResponseEntity.ok(Map.of("stations", nearbyStations));
    }
}