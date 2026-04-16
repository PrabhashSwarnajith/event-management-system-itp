package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.BookingRequest;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        String email = authentication.getName();
        return new ResponseEntity<>(bookingService.createBooking(request, email), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(email));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        bookingService.cancelBooking(id, email);
        return ResponseEntity.ok().build();
    }
}
