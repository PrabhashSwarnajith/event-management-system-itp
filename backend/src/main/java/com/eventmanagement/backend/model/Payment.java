package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false)
    private Double amount;

    // PENDING, COMPLETED, FAILED, REFUNDED
    @Column(nullable = false)
    private String status = "PENDING";

    // CARD, BANK_TRANSFER, CASH, MOCK
    @Column(nullable = false)
    private String paymentMethod = "MOCK";

    private String transactionReference;

    private LocalDateTime paidAt;

    @PrePersist
    public void prePersist() {
        if (this.paidAt == null) {
            this.paidAt = LocalDateTime.now();
        }
    }
}
