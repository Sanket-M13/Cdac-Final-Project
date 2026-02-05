package com.evcharger.api.service;

import com.evcharger.api.dto.UserVehicleRequest;
import com.evcharger.api.entity.User;
import com.evcharger.api.entity.VehicleBrand;
import com.evcharger.api.entity.VehicleModel;
import com.evcharger.api.repository.UserRepository;
import com.evcharger.api.repository.VehicleBrandRepository;
import com.evcharger.api.repository.VehicleModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VehicleService {
    @Autowired
    private VehicleBrandRepository vehicleBrandRepository;

    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getAllBrands() {
        return vehicleBrandRepository.findAll().stream()
                .map(brand -> {
                    Map<String, Object> brandMap = new HashMap<>();
                    brandMap.put("id", brand.getId());
                    brandMap.put("name", brand.getName());
                    brandMap.put("type", brand.getType());
                    return brandMap;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getBrandsByType(String type) {
        return vehicleBrandRepository.findByTypeIgnoreCase(type).stream()
                .map(brand -> {
                    Map<String, Object> brandMap = new HashMap<>();
                    brandMap.put("id", brand.getId());
                    brandMap.put("name", brand.getName());
                    return brandMap;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getModelsByBrand(Long brandId) {
        return vehicleModelRepository.findByVehicleBrandId(brandId).stream()
                .map(model -> {
                    Map<String, Object> modelMap = new HashMap<>();
                    modelMap.put("id", model.getId());
                    modelMap.put("name", model.getName());
                    modelMap.put("range", 300); // Default range
                    return modelMap;
                })
                .collect(Collectors.toList());
    }

    public void saveUserVehicle(String email, UserVehicleRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVehicleBrand(request.getBrand());
        user.setVehicleModel(request.getModel());
        // DO NOT SAVE - CAUSES ROLE OVERRIDE
        // userRepository.save(user);
    }

    public Map<String, String> getUserVehicle(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> vehicle = new HashMap<>();
        vehicle.put("brand", user.getVehicleBrand());
        vehicle.put("model", user.getVehicleModel());
        return vehicle;
    }
}