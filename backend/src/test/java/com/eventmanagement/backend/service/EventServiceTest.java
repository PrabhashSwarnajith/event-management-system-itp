package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createEventDefaultsBlankStatusToPublishedAndSavesEvent() {
        Venue venue = venue(2L, "Main Auditorium", 250);
        EventRequest request = eventRequest(2L, "Tech Talk", " technology ", null);

        when(venueRepository.findById(2L)).thenReturn(Optional.of(venue));
        when(eventRepository.existsByVenueIdAndEventDateAndStatusNot(2L, request.getEventDate(), "CANCELLED"))
                .thenReturn(false);
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event saved = invocation.getArgument(0);
            saved.setId(9L);
            return saved;
        });

        Event createdEvent = eventService.createEvent(request);

        ArgumentCaptor<Event> eventCaptor = ArgumentCaptor.forClass(Event.class);
        verify(eventRepository).save(eventCaptor.capture());
        Event savedEvent = eventCaptor.getValue();

        assertThat(createdEvent.getId()).isEqualTo(9L);
        assertThat(savedEvent.getTitle()).isEqualTo("Tech Talk");
        assertThat(savedEvent.getVenue()).isSameAs(venue);
        assertThat(savedEvent.getStatus()).isEqualTo("PUBLISHED");
    }

    @Test
    void createEventRejectsVenueClashForActiveEvent() {
        Venue venue = venue(3L, "Lab A", 50);
        EventRequest request = eventRequest(3L, "AI Workshop", "Workshop", "DRAFT");

        when(venueRepository.findById(3L)).thenReturn(Optional.of(venue));
        when(eventRepository.existsByVenueIdAndEventDateAndStatusNot(3L, request.getEventDate(), "CANCELLED"))
                .thenReturn(true);

        assertThatThrownBy(() -> eventService.createEvent(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Venue is already booked for another active event at this date and time");

        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void createCancelledEventSkipsVenueClashCheck() {
        Venue venue = venue(4L, "Seminar Room", 80);
        EventRequest request = eventRequest(4L, "Cancelled Meetup", "Community", "cancelled");

        when(venueRepository.findById(4L)).thenReturn(Optional.of(venue));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Event createdEvent = eventService.createEvent(request);

        assertThat(createdEvent.getStatus()).isEqualTo("CANCELLED");
        verify(eventRepository, never()).existsByVenueIdAndEventDateAndStatusNot(any(), any(), any());
    }

    @Test
    void getEventsFiltersByOrganizerSearchAndStatus() {
        Event publishedTech = event(1L, "Tech Expo", "Conference", "PUBLISHED", 99L);
        Event draftTech = event(2L, "Tech Planning", "Meeting", "DRAFT", 99L);
        Event music = event(3L, "Music Night", "Entertainment", "PUBLISHED", 99L);

        when(eventRepository.findByOrganizerId(99L)).thenReturn(List.of(publishedTech, draftTech, music));

        List<Event> events = eventService.getEvents("tech", 99L, " published ");

        assertThat(events).containsExactly(publishedTech);
    }

    @Test
    void getEventByIdThrowsWhenEventDoesNotExist() {
        when(eventRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getEventById(404L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Event not found with ID: 404");
    }

    @Test
    void searchEventsFallsBackToCategoryWhenTitleHasNoMatches() {
        Event sportsEvent = event(10L, "Interfaculty Finals", "Sports", "PUBLISHED", 22L);

        when(eventRepository.findByTitleContainingIgnoreCase("sports")).thenReturn(List.of());
        when(eventRepository.findByCategoryContainingIgnoreCase("sports")).thenReturn(List.of(sportsEvent));

        List<Event> results = eventService.searchEvents("sports");

        assertThat(results).containsExactly(sportsEvent);
    }

    private EventRequest eventRequest(Long venueId, String title, String category, String status) {
        EventRequest request = new EventRequest();
        request.setTitle(title);
        request.setDescription("Event description");
        request.setVenueId(venueId);
        request.setCategory(category);
        request.setEventDate(LocalDateTime.of(2026, 6, 10, 14, 0));
        request.setCapacity(120);
        request.setOrganizerId(42L);
        request.setStatus(status);
        return request;
    }

    private Venue venue(Long id, String name, Integer capacity) {
        Venue venue = new Venue();
        venue.setId(id);
        venue.setName(name);
        venue.setLocation("Colombo");
        venue.setCapacity(capacity);
        return venue;
    }

    private Event event(Long id, String title, String category, String status, Long organizerId) {
        Event event = new Event();
        event.setId(id);
        event.setTitle(title);
        event.setDescription("Description");
        event.setCategory(category);
        event.setStatus(status);
        event.setOrganizerId(organizerId);
        event.setEventDate(LocalDateTime.of(2026, 6, 12, 9, 0));
        event.setCapacity(100);
        event.setVenue(venue(1L, "Hall", 100));
        return event;
    }
}
