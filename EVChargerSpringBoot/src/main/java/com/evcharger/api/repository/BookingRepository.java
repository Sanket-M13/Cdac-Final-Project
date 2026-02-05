package com.evcharger.api.repository;

import com.evcharger.api.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByStationId(Long stationId);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.station JOIN FETCH b.user")
    List<Booking> findAllWithStationAndUser();
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.station WHERE b.userId = :userId")
    List<Booking> findByUserIdWithStation(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.user WHERE b.stationId = :stationId")
    List<Booking> findByStationIdWithUser(@Param("stationId") Long stationId);
}