package com.evcharger.api.repository;

import com.evcharger.api.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.station ORDER BY r.rating ASC")
    List<Review> findAllWithUserAndStation();
    
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user WHERE r.stationId = :stationId")
    List<Review> findByStationIdWithUser(@Param("stationId") Long stationId);
    
    List<Review> findByStationId(Long stationId);
    
    List<Review> findByUserId(Long userId);
}