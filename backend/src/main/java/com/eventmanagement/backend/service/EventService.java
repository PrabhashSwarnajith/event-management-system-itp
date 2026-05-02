package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private static final String STATUS_DRAFT = "DRAFT";
    private static final String STATUS_PUBLISHED = "PUBLISHED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public Event createEvent(EventRequest request) {
        Event event = new Event();
        updateEventFields(event, request);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEvents(String search, Long organizerId, String status) {
        List<Event> events = organizerId != null
                ? eventRepository.findByOrganizerId(organizerId)
                : eventRepository.findAll();

        String normalizedSearch = search == null ? "" : search.trim().toLowerCase();
        String normalizedStatus = status == null || status.isBlank() ? null : normalizeStatus(status);

        return events.stream()
                .filter(event -> normalizedSearch.isBlank()
                        || contains(event.getTitle(), normalizedSearch)
                        || contains(event.getCategory(), normalizedSearch))
                .filter(event -> normalizedStatus == null || normalizedStatus.equalsIgnoreCase(event.getStatus()))
                .toList();
    }

    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
    }

    public List<Event> searchEvents(String query) {
        // Return matching categories or titles to keep search flexible for uni project
        List<Event> matches = eventRepository.findByTitleContainingIgnoreCase(query);
        if (matches.isEmpty()) {
            return eventRepository.findByCategoryContainingIgnoreCase(query);
        }
        return matches;
    }

    public Event updateEvent(Long id, EventRequest request) {
        Event event = getEventById(id);
        updateEventFields(event, request);
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    private void updateEventFields(Event event, EventRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + request.getVenueId()));
        String status = normalizeStatus(request.getStatus());

        ensureNoVenueClash(event, venue, request.getEventDate(), status);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(venue);
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setBannerUrl(request.getBannerUrl());
        event.setDocumentUrl(request.getDocumentUrl());
        event.setCapacity(request.getCapacity());
        event.setOrganizerId(request.getOrganizerId());
        event.setStatus(status);
    }

    private void ensureNoVenueClash(Event event, Venue venue, java.time.LocalDateTime eventDate, String status) {
        if (STATUS_CANCELLED.equals(status)) {
            return;
        }

        boolean hasClash = event.getId() == null
                ? eventRepository.existsByVenueIdAndEventDateAndStatusNot(venue.getId(), eventDate, STATUS_CANCELLED)
                : eventRepository.existsByVenueIdAndEventDateAndStatusNotAndIdNot(venue.getId(), eventDate, STATUS_CANCELLED, event.getId());

        if (hasClash) {
            throw new IllegalArgumentException("Venue is already booked for another active event at this date and time");
        }
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return STATUS_PUBLISHED;
        }

        String normalized = status.trim().toUpperCase();
        if (!STATUS_DRAFT.equals(normalized)
                && !STATUS_PUBLISHED.equals(normalized)
                && !STATUS_CANCELLED.equals(normalized)) {
            throw new IllegalArgumentException("Invalid event status. Use DRAFT, PUBLISHED, or CANCELLED");
        }
        return normalized;
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
