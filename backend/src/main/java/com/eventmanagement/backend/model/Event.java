package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    // We use a simple URL string instead of Amazon S3 uploads for the Uni project scale
    @Column(length = 1000)
    private String bannerUrl;
    
    @Column(length = 1000)
    private String documentUrl; // E.g. PDF link for schedules

    @NotNull(message = "Capacity must be set")
    private Integer capacity;

    // DRAFT, PUBLISHED, CANCELLED
    @Column(nullable = false)
    private String status = "PUBLISHED";

    private Long organizerId;

    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Booking> bookings;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "PUBLISHED";
        }
    }
}
