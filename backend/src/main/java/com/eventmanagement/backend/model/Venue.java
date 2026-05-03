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
@Table(name = "venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Venue name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Capacity is required")
    private Integer capacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000)
    private String amenities;

    @Column(length = 1000)
    private String imageUrl;

    private Boolean available = true;

    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Event> events;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.available == null) {
            this.available = true;
        }
    }
}
