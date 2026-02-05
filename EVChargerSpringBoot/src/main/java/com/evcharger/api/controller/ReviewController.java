package com.evcharger.api.controller;

import com.evcharger.api.dto.CreateReviewDto;
import com.evcharger.api.entity.Review;
import com.evcharger.api.entity.User;
import com.evcharger.api.entity.Station;
import com.evcharger.api.repository.ReviewRepository;
import com.evcharger.api.repository.UserRepository;
import com.evcharger.api.repository.StationRepository;
import com.evcharger.api.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Review management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ReviewController {
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StationRepository stationRepository;

    @GetMapping
    @Operation(summary = "Get all reviews", description = "Get all reviews with user and station information")
    public ResponseEntity<?> getAllReviews() {
        try {
            List<Review> reviews = reviewRepository.findAllWithUserAndStation();
            List<Map<String, Object>> reviewList = new ArrayList<>();
            
            for (Review review : reviews) {
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
            
            
            reviewList.sort((a, b) -> Integer.compare((Integer) a.get("rating"), (Integer) b.get("rating")));
            
            return ResponseEntity.ok(reviewList);
        } catch (Exception e) {
            logger.error("Error getting all reviews: {}", e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/station/{stationId}")
    @Operation(summary = "Get station reviews", description = "Get all reviews for a specific station")
    public ResponseEntity<?> getStationReviews(@PathVariable Long stationId) {
        try {
            List<Review> reviews = reviewRepository.findByStationIdWithUser(stationId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Error getting station reviews: {}", e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin reviews", description = "Get all reviews for admin management")
    public ResponseEntity<?> getAdminReviews() {
        
        return ResponseEntity.ok(new ArrayList<>());
    }

    @PostMapping
    @Operation(summary = "Create review", description = "Create a new review for a station")
    public ResponseEntity<?> createReview(@Valid @RequestBody CreateReviewDto dto, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            
            Review review = new Review();
            review.setUserId(userId);
            review.setStationId(dto.getStationId());
            review.setRating(dto.getRating());
            review.setComment(dto.getComment());
            
            reviewRepository.save(review);
            
            return ResponseEntity.ok(Map.of("message", "Review created successfully"));
        } catch (Exception e) {
            logger.error("Error creating review: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Error creating review"));
        }
    }
}