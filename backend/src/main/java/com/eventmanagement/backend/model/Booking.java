package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer ticketCount;

    // PENDING, CONFIRMED, CANCELLED
    private String status = "CONFIRMED"; 

    private LocalDateTime bookingDate;

    @PrePersist
    public void prePersist() {
        this.bookingDate = LocalDateTime.now();
    }
}
