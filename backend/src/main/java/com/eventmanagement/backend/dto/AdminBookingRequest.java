package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminBookingRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Ticket count is required")
    @Min(value = 1, message = "Ticket count must be at least 1")
    private Integer ticketCount;
}
