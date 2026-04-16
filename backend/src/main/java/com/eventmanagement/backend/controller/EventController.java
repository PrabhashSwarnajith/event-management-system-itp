package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<Event>> searchByTitle(@RequestParam String title) {
        List<Event> events = eventService.searchEventsByTitle(title);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/filter/category")
    public ResponseEntity<List<Event>> filterByCategory(@RequestParam String category) {
        List<Event> events = eventService.filterEventsByCategory(category);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/filter/daterange")
    public ResponseEntity<List<Event>> filterByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Event> events = eventService.filterEventsByDateRange(start, end);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/filter/advanced")
    public ResponseEntity<List<Event>> advancedFilter(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Event> events;
        if (category != null && start != null && end != null) {
            events = eventService.filterByCategoryAndDateRange(category, start, end);
        } else if (category != null) {
            events = eventService.filterEventsByCategory(category);
        } else if (start != null && end != null) {
            events = eventService.filterEventsByDateRange(start, end);
        } else {
            events = eventService.getAllEvents();
        }
        return ResponseEntity.ok(events);
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getOrganizerEvents(@PathVariable Long organizerId) {
        List<Event> events = eventService.getEventsByOrganizer(organizerId);
        return ResponseEntity.ok(events);
    }
}
