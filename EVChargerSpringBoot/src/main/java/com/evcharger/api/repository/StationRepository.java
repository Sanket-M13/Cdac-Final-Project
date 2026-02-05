package com.evcharger.api.repository;

import com.evcharger.api.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByStatus(String status);
    
    List<Station> findByStationMasterId(Long stationMasterId);
    
    List<Station> findByApprovalStatus(String approvalStatus);
    
    @Query("SELECT s FROM Station s WHERE s.status = 'Available'")
    List<Station> findAvailableStations();
    
    @Query("SELECT s FROM Station s LEFT JOIN FETCH s.stationMaster")
    List<Station> findAllWithStationMaster();
}