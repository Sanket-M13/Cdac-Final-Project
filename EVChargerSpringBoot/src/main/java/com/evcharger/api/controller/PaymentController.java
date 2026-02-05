package com.evcharger.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@Tag(name = "Payment", description = "Payment processing APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_your_key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:your_key_secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    @Operation(summary = "Create Razorpay order", description = "Create a new payment order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
           
            Integer amountInPaise = (Integer) request.get("amount");
            
            if (amountInPaise == null || amountInPaise <= 0) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid amount"));
            }

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        
            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", amountInPaise); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            return ResponseEntity.ok(Map.of(
                "id", order.get("id"),
                "amount", order.get("amount"), // This will be in paise
                "currency", order.get("currency"),
                "status", order.get("status")
            ));

        } catch (RazorpayException e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to create order: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify payment", description = "Verify Razorpay payment signature")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        try {
            String paymentId = (String) request.get("razorpay_payment_id");
            String orderId = (String) request.get("razorpay_order_id");
            String signature = (String) request.get("razorpay_signature");
            Integer expectedAmount = (Integer) request.get("amount"); // Amount in paise

            if (paymentId == null || orderId == null || signature == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Missing payment details"));
            }

            // Verify signature
            String generatedSignature = generateSignature(orderId, paymentId, razorpayKeySecret);
            
            if (!generatedSignature.equals(signature)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Invalid signature"));
            }

          
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            Order order = razorpayClient.orders.fetch(orderId);
            
            Integer actualAmount = (Integer) order.get("amount");
            
            if (!actualAmount.equals(expectedAmount)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Amount mismatch. Expected: " + expectedAmount + ", Actual: " + actualAmount));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "paymentId", paymentId,
                "orderId", orderId,
                "amount", actualAmount
            ));

        } catch (RazorpayException e) {
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "error", "Payment verification failed: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "error", "Internal server error: " + e.getMessage()));
        }
    }

    private String generateSignature(String orderId, String paymentId, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }
}