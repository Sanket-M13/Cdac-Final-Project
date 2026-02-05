package com.evcharger.api.service;

import com.evcharger.api.dto.ChangePasswordDto;
import com.evcharger.api.dto.UpdateProfileDto;
import com.evcharger.api.dto.UserDto;
import com.evcharger.api.entity.User;
import com.evcharger.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateProfile(String email, UpdateProfileDto updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getName() != null) user.setName(updateDto.getName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        if (updateDto.getVehicleNumber() != null) user.setVehicleNumber(updateDto.getVehicleNumber());
        if (updateDto.getVehicleType() != null) user.setVehicleType(updateDto.getVehicleType());
        if (updateDto.getVehicleBrand() != null) user.setVehicleBrand(updateDto.getVehicleBrand());
        if (updateDto.getVehicleModel() != null) user.setVehicleModel(updateDto.getVehicleModel());

        // DO NOT SAVE - CAUSES ROLE OVERRIDE
        // User savedUser = userRepository.save(user);
        return convertToDto(user);
    }

    public void changePassword(String email, ChangePasswordDto changePasswordDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Only update password in database using native query to avoid role override
        userRepository.updatePasswordByEmail(email, passwordEncoder.encode(changePasswordDto.getNewPassword()));
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setVehicleNumber(user.getVehicleNumber());
        dto.setVehicleType(user.getVehicleType());
        dto.setVehicleBrand(user.getVehicleBrand());
        dto.setVehicleModel(user.getVehicleModel());
        return dto;
    }
}