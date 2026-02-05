package com.evcharger.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "UserId")
    private Long userId;

    private String brand;
    private String model;
    private String vehicleNumber;
    @Column(name = "vehicle_range")
    private Integer vehicleRange;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", insertable = false, updatable = false)
    private User user;

    // Constructors
    public Car() {}

    public Car(Long userId, String brand, String model, String vehicleNumber, Integer vehicleRange) {
        this.userId = userId;
        this.brand = brand;
        this.model = model;
        this.vehicleNumber = vehicleNumber;
        this.vehicleRange = vehicleRange;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public Integer getVehicleRange() { return vehicleRange; }
    public void setVehicleRange(Integer vehicleRange) { this.vehicleRange = vehicleRange; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}