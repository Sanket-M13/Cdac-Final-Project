package com.evcharger.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class EVChargerApiApplication {

    @GetMapping("/")
    public String home() {
        return "EV Charger API is running!";
    }

    public static void main(String[] args) {
        SpringApplication.run(EVChargerApiApplication.class, args);
    }
}