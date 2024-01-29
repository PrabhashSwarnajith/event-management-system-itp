package com.eventmanagement.backend.service;

import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        if (eventDetails.getTitle() != null) {
            event.setTitle(eventDetails.getTitle());
        }
        if (eventDetails.getDescription() != null) {
            event.setDescription(eventDetails.getDescription());
        }
        if (eventDetails.getCategory() != null) {
            event.setCategory(eventDetails.getCategory());
        }
        if (eventDetails.getEventDate() != null) {
            event.setEventDate(eventDetails.getEventDate());
        }
        if (eventDetails.getCapacity() != null) {
            event.setCapacity(eventDetails.getCapacity());
        }
        if (eventDetails.getTicketPrice() != null) {
            event.setTicketPrice(eventDetails.getTicketPrice());
        }
        if (eventDetails.getVenueId() != null) {
            event.setVenueId(eventDetails.getVenueId());
        }
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.searchByTitle(title);
    }

    public List<Event> filterEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> filterEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByEventDateBetween(start, end);
    }

    public List<Event> filterByCategoryAndDateRange(String category, LocalDateTime start, LocalDateTime end) {
        return eventRepository.filterByCategoryAndDateRange(category, start, end);
    }

    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }
}
