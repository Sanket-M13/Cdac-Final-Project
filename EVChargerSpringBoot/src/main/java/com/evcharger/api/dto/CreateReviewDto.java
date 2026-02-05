package com.evcharger.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateReviewDto {
    @NotNull(message = "Station ID is required")
    private Long stationId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    private String comment = "";

    // Constructors
    public CreateReviewDto() {}

    public CreateReviewDto(Long stationId, Integer rating, String comment) {
        this.stationId = stationId;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}