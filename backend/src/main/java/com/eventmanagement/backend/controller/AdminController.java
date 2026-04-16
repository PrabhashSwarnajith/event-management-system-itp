package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.VenueRepository;
import com.eventmanagement.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
