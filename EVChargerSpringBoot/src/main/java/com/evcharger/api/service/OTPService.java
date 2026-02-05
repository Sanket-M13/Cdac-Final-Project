package com.evcharger.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, Long> otpTimestamp = new HashMap<>();
    
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    public void sendOTP(String email) {
        String otp = generateOTP();
        otpStorage.put(email, otp);
        otpTimestamp.put(email, System.currentTimeMillis());
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("EV Charger - Login OTP");
        message.setText("Your OTP for login is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email");
        }
    }
    
    public boolean verifyOTP(String email, String otp) {
        String storedOTP = otpStorage.get(email);
        Long timestamp = otpTimestamp.get(email);
        
        if (storedOTP == null || timestamp == null) {
            return false;
        }
        
        // Check if OTP is expired (5 minutes)
        if (System.currentTimeMillis() - timestamp > 300000) {
            otpStorage.remove(email);
            otpTimestamp.remove(email);
            return false;
        }
        
        boolean isValid = storedOTP.equals(otp);
        if (isValid) {
            otpStorage.remove(email);
            otpTimestamp.remove(email);
        }
        
        return isValid;
    }
}