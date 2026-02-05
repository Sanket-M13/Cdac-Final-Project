package com.evcharger.api.repository;

import com.evcharger.api.entity.VehicleBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleBrandRepository extends JpaRepository<VehicleBrand, Long> {
    List<VehicleBrand> findByTypeIgnoreCase(String type);
}