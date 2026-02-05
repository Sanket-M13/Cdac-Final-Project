package com.evcharger.api.controller;

import com.evcharger.api.service.BookingService;
import com.evcharger.api.service.StationService;
import com.evcharger.api.service.UserService;
import com.evcharger.api.repository.ReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AdminController {

    @Autowired
    private com.evcharger.api.repository.StationRepository stationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private StationService stationService;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get dashboard statistics", description = "Get admin dashboard statistics")
    public ResponseEntity<?> getDashboardStats() {
        // Mock implementation - replace with actual service calls
        Map<String, Object> stats = Map.of(
            "totalUsers", userService.getAllUsers().size(),
            "totalStations", stationService.getAllStations().size(),
            "totalBookings", bookingService.getAllBookings().size(),
            "activeBookings", bookingService.getAllBookings().stream()
                .mapToInt(b -> "Confirmed".equals(b.getStatus()) ? 1 : 0).sum(),
            "revenue", 50000.0
        );
        return ResponseEntity.ok(Map.of("stats", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin)", description = "Get all users for admin management")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(Map.of("users", userService.getAllUsers()));
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings (Admin)", description = "Get all bookings for admin management")
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(Map.of("bookings", bookingService.getAllBookings()));
    }
    
    @GetMapping("/reviews")
    @Operation(summary = "Get all reviews (Admin)", description = "Get all reviews for admin management")
    public ResponseEntity<?> getAllReviews() {
        try {
            var reviews = reviewRepository.findAllWithUserAndStation();
            List<Map<String, Object>> reviewList = new ArrayList<>();
            
            for (var review : reviews) {
                Map<String, Object> reviewMap = new HashMap<>();
                reviewMap.put("id", review.getId());
                reviewMap.put("userId", review.getUserId());
                reviewMap.put("stationId", review.getStationId());
                reviewMap.put("rating", review.getRating());
                reviewMap.put("comment", review.getComment());
                reviewMap.put("createdAt", review.getCreatedAt());
                
                // User info
                Map<String, Object> userInfo = new HashMap<>();
                if (review.getUser() != null) {
                    userInfo.put("name", review.getUser().getName());
                    userInfo.put("email", review.getUser().getEmail());
                } else {
                    userInfo.put("name", "Unknown");
                    userInfo.put("email", "Unknown");
                }
                reviewMap.put("user", userInfo);
                
                // Station info
                Map<String, Object> stationInfo = new HashMap<>();
                if (review.getStation() != null) {
                    stationInfo.put("name", review.getStation().getName());
                } else {
                    stationInfo.put("name", "Unknown");
                }
                reviewMap.put("station", stationInfo);
                
                reviewList.add(reviewMap);
            }
            
            // Sort by rating (ascending) to match .NET implementation
            reviewList.sort((a, b) -> Integer.compare((Integer) a.get("rating"), (Integer) b.get("rating")));
            
            return ResponseEntity.ok(reviewList);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/stations")
    @Operation(summary = "Get all stations (Admin)", description = "Get all stations for admin management")
    public ResponseEntity<?> getAllStationsForAdmin() {
        return ResponseEntity.ok(Map.of("stations", stationService.getAllStations()));
    }

    @GetMapping("/stations/pending")
    @Operation(summary = "Get pending stations", description = "Get all stations pending approval")
    public ResponseEntity<?> getPendingStations() {
        return ResponseEntity.ok(Map.of("stations", stationService.getStationsByApprovalStatus("Pending")));
    }

    @PutMapping("/stations/{id}/approve")
    @Operation(summary = "Approve station", description = "Approve a pending station")
    public ResponseEntity<?> approveStation(@PathVariable Long id) {
        try {
            stationService.updateStationApprovalStatus(id, "Approved");
            return ResponseEntity.ok(Map.of("message", "Station approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve station: " + e.getMessage()));
        }
    }

    @PutMapping("/stations/{id}/reject")
    @Operation(summary = "Reject station", description = "Reject a pending station")
    public ResponseEntity<?> rejectStation(@PathVariable Long id) {
        try {
            stationService.updateStationApprovalStatus(id, "Rejected");
            return ResponseEntity.ok(Map.of("message", "Station rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject station: " + e.getMessage()));
        }
    }

}