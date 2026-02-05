package com.evcharger.api.controller;

import com.evcharger.api.dto.UserVehicleRequest;
import com.evcharger.api.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicles", description = "Vehicle management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/brands")
    @Operation(summary = "Get all vehicle brands", description = "Retrieve all vehicle brands")
    public ResponseEntity<List<Map<String, Object>>> getAllBrands() {
        List<Map<String, Object>> brands = vehicleService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/brands/{type}")
    @Operation(summary = "Get brands by type", description = "Retrieve vehicle brands by type (Car/Bike)")
    public ResponseEntity<List<Map<String, Object>>> getBrandsByType(@PathVariable String type) {
        List<Map<String, Object>> brands = vehicleService.getBrandsByType(type);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/brands/{brandId}/models")
    @Operation(summary = "Get models by brand", description = "Retrieve vehicle models for a specific brand")
    public ResponseEntity<List<Map<String, Object>>> getModelsByBrand(@PathVariable Long brandId) {
        List<Map<String, Object>> models = vehicleService.getModelsByBrand(brandId);
        return ResponseEntity.ok(models);
    }

    @PostMapping("/user-vehicle")
    @Operation(summary = "Save user vehicle", description = "Save user's vehicle information")
    public ResponseEntity<?> saveUserVehicle(@RequestBody UserVehicleRequest request,
                                            Authentication authentication) {
        try {
            vehicleService.saveUserVehicle(authentication.getName(), request);
            return ResponseEntity.ok(Map.of("message", "Vehicle data saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found"));
        }
    }

    @GetMapping("/user-vehicle")
    @Operation(summary = "Get user vehicle", description = "Get current user's vehicle information")
    public ResponseEntity<?> getUserVehicle(Authentication authentication) {
        try {
            Map<String, String> vehicle = vehicleService.getUserVehicle(authentication.getName());
            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found"));
        }
    }
}