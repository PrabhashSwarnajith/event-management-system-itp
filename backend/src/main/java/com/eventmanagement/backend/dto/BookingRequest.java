package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Ticket count is required")
    @Min(value = 1, message = "At least one ticket must be booked")
    private Integer ticketCount;
}
