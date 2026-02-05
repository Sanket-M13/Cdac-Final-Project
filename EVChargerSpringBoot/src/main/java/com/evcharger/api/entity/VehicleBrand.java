package com.evcharger.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "VehicleBrands")
public class VehicleBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String type; // "Car" or "Bike"

    @OneToMany(mappedBy = "vehicleBrand", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VehicleModel> models = new ArrayList<>();

    // Constructors
    public VehicleBrand() {}

    public VehicleBrand(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<VehicleModel> getModels() { return models; }
    public void setModels(List<VehicleModel> models) { this.models = models; }
}