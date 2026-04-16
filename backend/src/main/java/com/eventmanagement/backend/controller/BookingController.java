package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.BookingRequest;
import com.eventmanagement.backend.dto.BookingTicketResponse;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(bookingService.createBooking(request, user.getEmail()), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getEmail()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id, @AuthenticationPrincipal User user) {
        bookingService.cancelBooking(id, user.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<BookingTicketResponse> getTicket(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getTicket(id, user.getEmail()));
    }
}
