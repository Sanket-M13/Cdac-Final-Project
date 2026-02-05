package com.evcharger.api.controller;

import com.evcharger.api.dto.*;
import com.evcharger.api.entity.User;
import com.evcharger.api.repository.UserRepository;
import com.evcharger.api.service.AuthService;
import com.evcharger.api.service.OTPService;
import com.evcharger.api.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:4173"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;
    
    @Autowired
    private OTPService otpService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginRequest) {
        try {
            Map<String, Object> response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid credentials"));
        }
    }
    
    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP", description = "Send OTP to user email for login")
    public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            otpService.sendOTP(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to send OTP"));
        }
    }
    
    @PostMapping("/login-otp")
    @Operation(summary = "Login with OTP", description = "Authenticate user with OTP")
    public ResponseEntity<?> loginWithOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            if (otpService.verifyOTP(email, otp)) {
                Map<String, Object> response = authService.authenticateUserByEmail(email);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid or expired OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP verification failed"));
        }
    }
    
    @GetMapping("/vehicle-brands")
    @Operation(summary = "Get vehicle brands", description = "Get all vehicle brands from database")
    public ResponseEntity<?> getVehicleBrands() {
        try {
            List<Map<String, Object>> brands = authService.getAllVehicleBrands();
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            logger.error("Error fetching vehicle brands: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Failed to fetch vehicle brands"));
        }
    }
    @PostMapping("/google-register")
    @Operation(summary = "Google OAuth Registration", description = "Register user with Google OAuth and complete details")
    public ResponseEntity<?> googleRegister(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String phone = request.get("phone");
            String vehicleNumber = request.get("vehicleNumber");
            String vehicleBrand = request.get("vehicleBrand");
            String vehicleType = request.get("vehicleType");
            String vehicleModel = request.get("vehicleModel");
            
            logger.info("Google registration for email: {}", email);
            
            // Create new user with Google OAuth + car details
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPasswordHash(""); // Empty password for OAuth users
            user.setPhone(phone);
            user.setVehicleNumber(vehicleNumber);
            user.setVehicleBrand(vehicleBrand);
            user.setVehicleType(vehicleType);
            user.setVehicleModel(vehicleModel);
            user.setRole("User");
            
            userRepository.save(user);
            
            // Generate JWT token without authentication for Google users
            String jwt = jwtUtils.generateTokenFromUsername(email);
            
            // Convert to DTO
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setEmail(user.getEmail());
            userDto.setName(user.getName());
            userDto.setRole(user.getRole());
            userDto.setPhone(user.getPhone());
            userDto.setVehicleNumber(user.getVehicleNumber());
            userDto.setVehicleType(user.getVehicleType());
            userDto.setVehicleBrand(user.getVehicleBrand());
            userDto.setVehicleModel(user.getVehicleModel());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Google registration error: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Registration failed"));
        }
    }
    
    @PostMapping("/google")
    @Operation(summary = "Google OAuth", description = "Authenticate user with Google OAuth")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            logger.info("Google OAuth attempt for email: {}", email);
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                // User exists - authenticate
                Map<String, Object> response = authService.authenticateUserByEmail(email);
                return ResponseEntity.ok(response);
            } else {
                // User doesn't exist - return 404 to trigger registration
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            logger.error("Google OAuth error: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Authentication failed"));
        }
    }
    
    @PostMapping("/update-car-details")
    @Operation(summary = "Update car details", description = "Update user car details after Google signup")
    public ResponseEntity<?> updateCarDetails(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            UserDto user = authService.updateCarDetails(email, request);
            return ResponseEntity.ok(Map.of("user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to update car details"));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register new user and return JWT token")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto signUpRequest) {
        try {
            Map<String, Object> response = authService.registerUser(signUpRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user details")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            UserDto user = authService.getCurrentUser(authentication.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update profile", description = "Update current user profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileDto updateRequest,
                                         Authentication authentication) {
        try {
            UserDto user = authService.updateProfile(authentication.getName(), updateRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}