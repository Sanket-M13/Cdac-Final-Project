package com.evcharger.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class StationDto {
    private Long id;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String address;
    
    @NotNull
    private Double latitude;
    
    @NotNull
    private Double longitude;
    
    private String[] connectorTypes;
    private String powerOutput;
    private BigDecimal pricePerKwh;
    private String[] amenities;
    private String operatingHours;
    private String status;
    private Integer totalSlots;
    private Integer availableSlots;
    private Double distance;
    private String ownerName;
    private String approvalStatus;

    public StationDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String[] getConnectorTypes() { return connectorTypes; }
    public void setConnectorTypes(String[] connectorTypes) { this.connectorTypes = connectorTypes; }

    public String getPowerOutput() { return powerOutput; }
    public void setPowerOutput(String powerOutput) { this.powerOutput = powerOutput; }

    public BigDecimal getPricePerKwh() { return pricePerKwh; }
    public void setPricePerKwh(BigDecimal pricePerKwh) { this.pricePerKwh = pricePerKwh; }

    public String[] getAmenities() { return amenities; }
    public void setAmenities(String[] amenities) { this.amenities = amenities; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}