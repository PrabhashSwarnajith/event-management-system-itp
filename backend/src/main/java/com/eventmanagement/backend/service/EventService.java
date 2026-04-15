package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(EventRequest request) {
        Event event = new Event();
        updateEventFields(event, request);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
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
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setBannerUrl(request.getBannerUrl());
        event.setDocumentUrl(request.getDocumentUrl());
        event.setCapacity(request.getCapacity());
        event.setOrganizerId(request.getOrganizerId());
    }
}
