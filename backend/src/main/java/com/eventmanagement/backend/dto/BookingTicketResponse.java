package com.eventmanagement.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingTicketResponse {
    private Long bookingId;
    private String confirmationCode;
    private String eventTitle;
    private LocalDateTime eventDate;
    private String venueName;
    private String attendeeName;
    private String attendeeEmail;
    private Integer ticketCount;
    private String status;
    private LocalDateTime bookingDate;
}
