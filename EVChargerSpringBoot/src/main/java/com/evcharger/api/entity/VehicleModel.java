package com.evcharger.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "VehicleModels")
public class VehicleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Column(name = "VehicleBrandId")
    private Long vehicleBrandId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehicleBrandId", insertable = false, updatable = false)
    private VehicleBrand vehicleBrand;

    // Constructors
    public VehicleModel() {}

    public VehicleModel(String name, Long vehicleBrandId) {
        this.name = name;
        this.vehicleBrandId = vehicleBrandId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getVehicleBrandId() { return vehicleBrandId; }
    public void setVehicleBrandId(Long vehicleBrandId) { this.vehicleBrandId = vehicleBrandId; }

    public VehicleBrand getVehicleBrand() { return vehicleBrand; }
    public void setVehicleBrand(VehicleBrand vehicleBrand) { this.vehicleBrand = vehicleBrand; }
}