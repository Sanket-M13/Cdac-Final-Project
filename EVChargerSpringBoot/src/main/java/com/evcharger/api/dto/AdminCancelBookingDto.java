package com.evcharger.api.dto;

public class AdminCancelBookingDto {
    private Long bookingId;
    private String message;

    public AdminCancelBookingDto() {}

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}