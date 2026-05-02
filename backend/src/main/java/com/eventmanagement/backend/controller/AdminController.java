package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.AdminBookingRequest;
import com.eventmanagement.backend.dto.AdminUserRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.VenueRepository;
import com.eventmanagement.backend.repository.BookingRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalVenues", venueRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList());
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody AdminUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = new User();
        applyUserRequest(user, request);
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        return ResponseEntity.ok(toUserResponse(userRepository.save(user)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        userRepository.findByEmail(request.getEmail())
                .filter(existingUser -> !existingUser.getId().equals(id))
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        applyUserRequest(user, request);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        }

        return ResponseEntity.ok(toUserResponse(userRepository.save(user)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookings() {
        return ResponseEntity.ok(bookingRepository.findAll().stream()
                .map(this::toBookingResponse)
                .toList());
    }

    @PostMapping("/bookings")
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody AdminBookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setTicketCount(request.getTicketCount());
        booking.setStatus("CONFIRMED");

        return ResponseEntity.ok(toBookingResponse(bookingRepository.save(booking)));
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with ID: " + id);
        }
        bookingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyUserRequest(User user, AdminUserRequest request) {
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
    }

    private Map<String, Object> toUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }

    private Map<String, Object> toBookingResponse(Booking booking) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", booking.getId());
        response.put("ticketCount", booking.getTicketCount());
        response.put("status", booking.getStatus());
        response.put("bookingDate", booking.getBookingDate());
        response.put("eventId", booking.getEvent().getId());
        response.put("eventTitle", booking.getEvent().getTitle());
        response.put("userId", booking.getUser().getId());
        response.put("userName", booking.getUser().getName());
        response.put("userEmail", booking.getUser().getEmail());
        return response;
    }
}
