package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {
    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private String bannerUrl;
    private String documentUrl;

    @NotNull(message = "Capacity must be set")
    private Integer capacity;

    @NotNull(message = "Organizer ID is required")
    private Long organizerId;
}
