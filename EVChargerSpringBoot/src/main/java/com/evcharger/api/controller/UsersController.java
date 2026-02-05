package com.evcharger.api.controller;

import com.evcharger.api.dto.ChangePasswordDto;
import com.evcharger.api.dto.UpdateProfileDto;
import com.evcharger.api.dto.UserDto;
import com.evcharger.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users (Admin only)")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get current user profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            UserDto user = userService.getUserProfile(authentication.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileDto updateDto,
                                         Authentication authentication) {
        try {
            UserDto user = userService.updateProfile(authentication.getName(), updateDto);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change current user password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto,
                                          Authentication authentication) {
        try {
            userService.changePassword(authentication.getName(), changePasswordDto);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}