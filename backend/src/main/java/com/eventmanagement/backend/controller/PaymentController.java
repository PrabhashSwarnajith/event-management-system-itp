package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.model.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * PaymentController — Member 4 (Ruwan) feature module.
 * Simulates a Stripe-like payment gateway for event ticket purchases.
 * In a production system, this would integrate with Stripe SDK.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    // Simulate payment processing (Stripe-like flow)
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User user) {

        Map<String, Object> response = new HashMap<>();

        // Validate card number (basic Luhn-like check for demo)
        if (!isValidCard(request.getCardNumber())) {
            response.put("success", false);
            response.put("message", "Invalid card number. Please check your details.");
            return ResponseEntity.badRequest().body(response);
        }

        // Simulate processing delay logic (decline specific test numbers)
        if ("4000000000000002".equals(request.getCardNumber().replaceAll("\\s", ""))) {
            response.put("success", false);
            response.put("message", "Your card was declined. Please try a different payment method.");
            return ResponseEntity.badRequest().body(response);
        }

        // Simulate successful payment
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String receiptUrl = "https://unievents.lk/receipts/" + transactionId;

        response.put("success", true);
        response.put("transactionId", transactionId);
        response.put("amount", request.getAmount());
        response.put("currency", "LKR");
        response.put("cardLast4", request.getCardNumber().replaceAll("\\s", "").substring(
                Math.max(0, request.getCardNumber().replaceAll("\\s", "").length() - 4)));
        response.put("receiptUrl", receiptUrl);
        response.put("paidAt", LocalDateTime.now().toString());
        response.put("userId", user != null ? user.getId() : null);
        response.put("bookingId", request.getBookingId());
        response.put("message", "Payment successful! Your booking is confirmed.");

        return ResponseEntity.ok(response);
    }

    // Get payment status for a booking
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User user) {

        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", bookingId);
        response.put("status", "PAID");
        response.put("message", "Payment completed successfully.");
        return ResponseEntity.ok(response);
    }

    private boolean isValidCard(String cardNumber) {
        if (cardNumber == null) return false;
        String cleaned = cardNumber.replaceAll("\\s", "");
        return cleaned.matches("\\d{16}");
    }

    @Data
    public static class PaymentRequest {
        private Long bookingId;
        private Double amount;
        private String cardNumber;
        private String cardHolderName;
        private String expiryDate;
        private String cvv;
        private String paymentMethod; // CARD, BANK_TRANSFER
    }
}
