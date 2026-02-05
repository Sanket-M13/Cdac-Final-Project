package com.evcharger.api.dto;

public class UserVehicleRequest {
    private String brand;
    private String model;
    private Integer batteryPercent;
    private Integer maxRange;

    public UserVehicleRequest() {}

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getBatteryPercent() { return batteryPercent; }
    public void setBatteryPercent(Integer batteryPercent) { this.batteryPercent = batteryPercent; }

    public Integer getMaxRange() { return maxRange; }
    public void setMaxRange(Integer maxRange) { this.maxRange = maxRange; }
}