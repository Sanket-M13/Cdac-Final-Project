package com.evcharger.api.service;

import com.evcharger.api.dto.AdminCancelBookingDto;
import com.evcharger.api.dto.BookingDto;
import com.evcharger.api.dto.CreateBookingDto;
import com.evcharger.api.entity.Booking;
import com.evcharger.api.entity.Station;
import com.evcharger.api.repository.BookingRepository;
import com.evcharger.api.repository.StationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StationRepository stationRepository;

    @Transactional
    public BookingDto createBooking(Long userId, CreateBookingDto createBookingDto) {
        logger.info("Creating booking for user {} with data: {}", userId, createBookingDto);
        
        Optional<Station> stationOpt = stationRepository.findById(createBookingDto.getStationId());
        if (stationOpt.isEmpty()) {
            throw new RuntimeException("Station not found");
        }

        Station station = stationOpt.get();
        
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setStationId(createBookingDto.getStationId());
        booking.setStartTime(createBookingDto.getStartTime());
        booking.setEndTime(createBookingDto.getEndTime());
        booking.setAmount(createBookingDto.getAmount());
        booking.setStatus(createBookingDto.getStatus() != null ? createBookingDto.getStatus() : "Confirmed");
        booking.setDate(createBookingDto.getDate() != null ? createBookingDto.getDate() : "");
        booking.setTimeSlot(createBookingDto.getTimeSlot() != null ? createBookingDto.getTimeSlot() : "");
        booking.setDuration(createBookingDto.getDuration());
        booking.setPaymentMethod(createBookingDto.getPaymentMethod() != null ? createBookingDto.getPaymentMethod() : "Card");
        booking.setVehicleType(createBookingDto.getVehicleType() != null ? createBookingDto.getVehicleType() : "");
        booking.setVehicleBrand(createBookingDto.getVehicleBrand() != null ? createBookingDto.getVehicleBrand() : "");
        booking.setVehicleModel(createBookingDto.getVehicleModel() != null ? createBookingDto.getVehicleModel() : "");
        booking.setVehicleNumber(createBookingDto.getVehicleNumber() != null ? createBookingDto.getVehicleNumber() : "");
        booking.setPaymentId(createBookingDto.getPaymentId() != null ? createBookingDto.getPaymentId() : "");

        // Update station available slots
        if (station.getAvailableSlots() > 0) {
            station.setAvailableSlots(station.getAvailableSlots() - 1);
            stationRepository.save(station);
        }

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Booking created successfully with ID: {}", savedBooking.getId());

        return convertToDto(savedBooking);
    }

    public List<BookingDto> getUserBookings(Long userId) {
        logger.info("Getting bookings for user ID: {}", userId);
        
        List<Booking> bookings = bookingRepository.findByUserIdWithStation(userId);
        logger.info("Found {} bookings for user {}", bookings.size(), userId);
        
        // Log each booking status
        for (Booking booking : bookings) {
            logger.info("Booking ID: {}, Status: {}, Station: {}", 
                       booking.getId(), booking.getStatus(), 
                       booking.getStation() != null ? booking.getStation().getName() : "Unknown");
        }
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BookingDto> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithStationAndUser();
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelUserBooking(Long bookingId, Long userId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        
        // Verify booking belongs to user
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Booking does not belong to user");
        }
        
        // Check if booking can be cancelled
        if ("Cancelled".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus("Cancelled");
        booking.setCancellationMessage("Cancelled by user");

        // Update station available slots
        Optional<Station> stationOpt = stationRepository.findById(booking.getStationId());
        if (stationOpt.isPresent()) {
            Station station = stationOpt.get();
            station.setAvailableSlots(station.getAvailableSlots() + 1);
            stationRepository.save(station);
        }

        bookingRepository.save(booking);
        logger.info("Booking {} cancelled by user {}", bookingId, userId);
    }

    @Transactional
    public void adminCancelBooking(AdminCancelBookingDto cancelDto) {
        Optional<Booking> bookingOpt = bookingRepository.findById(cancelDto.getBookingId());
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setStatus("Cancelled");
        booking.setCancellationMessage(cancelDto.getMessage());

        // Update station available slots
        Optional<Station> stationOpt = stationRepository.findById(booking.getStationId());
        if (stationOpt.isPresent()) {
            Station station = stationOpt.get();
            station.setAvailableSlots(station.getAvailableSlots() + 1);
            stationRepository.save(station);
        }

        bookingRepository.save(booking);
    }

    public List<BookingDto> getBookingsForStationMaster(Long stationId, Long stationMasterId) {
        // Verify station belongs to station master
        Optional<Station> stationOpt = stationRepository.findById(stationId);
        if (stationOpt.isEmpty()) {
            throw new RuntimeException("Station not found");
        }
        
        Station station = stationOpt.get();
        if (!station.getStationMaster().getId().equals(stationMasterId)) {
            throw new RuntimeException("Unauthorized: Station does not belong to this station master");
        }
        
        List<Booking> bookings = bookingRepository.findByStationIdWithUser(stationId);
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateBookingStatus(Long bookingId, String status) {
        logger.info("Updating booking {} status to {}", bookingId, status);
        
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            logger.error("Booking not found with ID: {}", bookingId);
            throw new RuntimeException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        String oldStatus = booking.getStatus();
        booking.setStatus(status);
        
        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Booking {} status updated from '{}' to '{}'. Saved booking status: {}", 
                   bookingId, oldStatus, status, savedBooking.getStatus());
    }

    public boolean bookingExists(Long bookingId) {
        return bookingRepository.existsById(bookingId);
    }

    public Optional<Booking> findById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }

    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setStationId(booking.getStationId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus() != null ? booking.getStatus() : "Confirmed");
        dto.setAmount(booking.getAmount());
        dto.setDate(booking.getDate() != null ? booking.getDate() : "");
        dto.setTimeSlot(booking.getTimeSlot() != null ? booking.getTimeSlot() : "");
        dto.setDuration(booking.getDuration());
        dto.setPaymentMethod(booking.getPaymentMethod() != null ? booking.getPaymentMethod() : "Card");
        dto.setVehicleType(booking.getVehicleType() != null ? booking.getVehicleType() : "");
        dto.setVehicleBrand(booking.getVehicleBrand() != null ? booking.getVehicleBrand() : "");
        dto.setVehicleModel(booking.getVehicleModel() != null ? booking.getVehicleModel() : "");
        dto.setVehicleNumber(booking.getVehicleNumber() != null ? booking.getVehicleNumber() : "");
        dto.setPaymentId(booking.getPaymentId() != null ? booking.getPaymentId() : "");
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setCancellationMessage(booking.getCancellationMessage());
        
        // Set station and user names if available
        if (booking.getStation() != null) {
            dto.setStationName(booking.getStation().getName());
        }
        if (booking.getUser() != null) {
            dto.setUserName(booking.getUser().getName());
        }
        
        return dto;
    }
}