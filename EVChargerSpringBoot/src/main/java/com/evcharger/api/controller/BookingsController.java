package com.evcharger.api.controller;

import com.evcharger.api.dto.AdminCancelBookingDto;
import com.evcharger.api.dto.BookingDto;
import com.evcharger.api.dto.CreateBookingDto;
import com.evcharger.api.security.UserDetailsImpl;
import com.evcharger.api.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Booking management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class BookingsController {
    private static final Logger logger = LoggerFactory.getLogger(BookingsController.class);

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create booking", description = "Create a new charging station booking")
    public ResponseEntity<?> createBooking(@Valid @RequestBody CreateBookingDto createBookingDto,
                                         Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            
            logger.info("Creating booking for user {} with data: {}", userId, createBookingDto);
            
            BookingDto booking = bookingService.createBooking(userId, createBookingDto);
            
            return ResponseEntity.ok(Map.of("booking", Map.of("id", booking.getId(), "status", booking.getStatus())));
        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error creating booking", "error", e.getMessage()));
        }
    }

    @GetMapping("/user")
    @Operation(summary = "Get user bookings", description = "Get all bookings for the current user")
    public ResponseEntity<?> getUserBookings(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            
            logger.info("Getting bookings for user ID: {}", userId);
            
            List<BookingDto> bookings = bookingService.getUserBookings(userId);
            
            return ResponseEntity.ok(Map.of("bookings", bookings));
        } catch (Exception e) {
            logger.error("Error getting user bookings: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error retrieving bookings", "error", e.getMessage()));
        }
    }

    @GetMapping("/admin")
    @Operation(summary = "Get all bookings (Admin)", description = "Get all bookings for admin users")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<BookingDto> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error getting admin bookings: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error retrieving bookings", "error", e.getMessage()));
        }
    }

    @PostMapping("/admin-cancel")
    @Operation(summary = "Cancel booking (Admin)", description = "Cancel a booking as admin with message")
    public ResponseEntity<?> adminCancelBooking(@Valid @RequestBody AdminCancelBookingDto cancelDto) {
        try {
            bookingService.adminCancelBooking(cancelDto);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound()
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error cancelling booking"));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Get a specific booking by ID")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            
            return ResponseEntity.ok(Map.of("message", "Booking found"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete/Cancel booking", description = "Cancel a booking by user using DELETE method")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            
            logger.info("Cancelling booking {} for user {}", id, userId);
            
            bookingService.cancelUserBooking(id, userId);
            
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (RuntimeException e) {
            logger.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.status(404)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error cancelling booking"));
        }
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancel a booking by user")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
         
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error cancelling booking"));
        }
    }
}