package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.BookingRequest;
import com.eventmanagement.backend.dto.BookingTicketResponse;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
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
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBookingSavesConfirmedBookingWhenTicketsAreAvailable() {
        User user = user(5L, "Student One", "student@unievents.lk");
        Event event = event(20L, "Innovation Day", 10, 100);
        BookingRequest request = bookingRequest(20L, 3);

        when(userRepository.findByEmail("student@unievents.lk")).thenReturn(Optional.of(user));
        when(eventRepository.findById(20L)).thenReturn(Optional.of(event));
        when(bookingRepository.countConfirmedTicketsForEvent(20L)).thenReturn(6);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking saved = invocation.getArgument(0);
            saved.setId(30L);
            return saved;
        });

        Booking booking = bookingService.createBooking(request, "student@unievents.lk");

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());
        Booking savedBooking = bookingCaptor.getValue();

        assertThat(booking.getId()).isEqualTo(30L);
        assertThat(savedBooking.getUser()).isSameAs(user);
        assertThat(savedBooking.getEvent()).isSameAs(event);
        assertThat(savedBooking.getTicketCount()).isEqualTo(3);
        assertThat(savedBooking.getStatus()).isEqualTo("CONFIRMED");
    }

    @Test
    void createBookingUsesVenueCapacityWhenEventCapacityIsMissing() {
        User user = user(6L, "Student Two", "student2@unievents.lk");
        Event event = event(21L, "Research Meetup", null, 6);
        BookingRequest request = bookingRequest(21L, 2);

        when(userRepository.findByEmail("student2@unievents.lk")).thenReturn(Optional.of(user));
        when(eventRepository.findById(21L)).thenReturn(Optional.of(event));
        when(bookingRepository.countConfirmedTicketsForEvent(21L)).thenReturn(4);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking booking = bookingService.createBooking(request, "student2@unievents.lk");

        assertThat(booking.getTicketCount()).isEqualTo(2);
        assertThat(booking.getEvent().getVenue().getCapacity()).isEqualTo(6);
    }

    @Test
    void createBookingRejectsRequestWhenCapacityWouldBeExceeded() {
        User user = user(7L, "Student Three", "student3@unievents.lk");
        Event event = event(22L, "Design Jam", 5, 50);
        BookingRequest request = bookingRequest(22L, 2);

        when(userRepository.findByEmail("student3@unievents.lk")).thenReturn(Optional.of(user));
        when(eventRepository.findById(22L)).thenReturn(Optional.of(event));
        when(bookingRepository.countConfirmedTicketsForEvent(22L)).thenReturn(4);

        assertThatThrownBy(() -> bookingService.createBooking(request, "student3@unievents.lk"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Not enough tickets available. Remaining tickets: 1");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void createBookingThrowsWhenUserDoesNotExist() {
        BookingRequest request = bookingRequest(23L, 1);

        when(userRepository.findByEmail("missing@unievents.lk")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(request, "missing@unievents.lk"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");
    }

    @Test
    void getUserBookingsReturnsNewestBookingsFirst() {
        User user = user(8L, "Student Four", "student4@unievents.lk");
        Booking olderBooking = booking(40L, user, event(24L, "Older Event", 100, 100),
                LocalDateTime.of(2026, 5, 1, 9, 0), "CONFIRMED");
        Booking newerBooking = booking(41L, user, event(25L, "Newer Event", 100, 100),
                LocalDateTime.of(2026, 5, 3, 9, 0), "CONFIRMED");

        when(userRepository.findByEmail("student4@unievents.lk")).thenReturn(Optional.of(user));
        when(bookingRepository.findByUserId(8L)).thenReturn(List.of(olderBooking, newerBooking));

        List<Booking> bookings = bookingService.getUserBookings("student4@unievents.lk");

        assertThat(bookings).containsExactly(newerBooking, olderBooking);
    }

    @Test
    void cancelBookingSetsStatusToCancelledForOwner() {
        User user = user(9L, "Student Five", "owner@unievents.lk");
        Booking booking = booking(50L, user, event(26L, "Owned Event", 100, 100),
                LocalDateTime.of(2026, 5, 2, 10, 0), "CONFIRMED");

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));

        bookingService.cancelBooking(50L, "owner@unievents.lk");

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());

        assertThat(bookingCaptor.getValue().getStatus()).isEqualTo("CANCELLED");
    }

    @Test
    void cancelBookingRejectsNonOwner() {
        User owner = user(10L, "Owner", "owner@unievents.lk");
        Booking booking = booking(51L, owner, event(27L, "Private Booking", 100, 100),
                LocalDateTime.of(2026, 5, 2, 11, 0), "CONFIRMED");

        when(bookingRepository.findById(51L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(51L, "other@unievents.lk"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("You can only cancel your own bookings");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void getTicketReturnsTicketDetailsForOwner() {
        User user = user(11L, "Ticket Owner", "ticket@unievents.lk");
        Event event = event(28L, "Cultural Fest", 100, 100);
        Booking booking = booking(60L, user, event,
                LocalDateTime.of(2026, 5, 3, 8, 30), "CONFIRMED");
        booking.setTicketCount(4);

        when(bookingRepository.findById(60L)).thenReturn(Optional.of(booking));

        BookingTicketResponse ticket = bookingService.getTicket(60L, "ticket@unievents.lk");

        assertThat(ticket.getBookingId()).isEqualTo(60L);
        assertThat(ticket.getConfirmationCode()).isEqualTo("BK-60-20260503");
        assertThat(ticket.getEventTitle()).isEqualTo("Cultural Fest");
        assertThat(ticket.getVenueName()).isEqualTo("Main Hall");
        assertThat(ticket.getAttendeeEmail()).isEqualTo("ticket@unievents.lk");
        assertThat(ticket.getTicketCount()).isEqualTo(4);
    }

    private BookingRequest bookingRequest(Long eventId, Integer ticketCount) {
        BookingRequest request = new BookingRequest();
        request.setEventId(eventId);
        request.setTicketCount(ticketCount);
        return request;
    }

    private User user(Long id, String name, String email) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setRole("ATTENDEE");
        user.setPassword("hashed-password");
        return user;
    }

    private Event event(Long id, String title, Integer eventCapacity, Integer venueCapacity) {
        Venue venue = new Venue();
        venue.setId(1L);
        venue.setName("Main Hall");
        venue.setLocation("Campus");
        venue.setCapacity(venueCapacity);

        Event event = new Event();
        event.setId(id);
        event.setTitle(title);
        event.setDescription("Description");
        event.setVenue(venue);
        event.setCategory("Academic");
        event.setEventDate(LocalDateTime.of(2026, 6, 15, 18, 0));
        event.setCapacity(eventCapacity);
        event.setStatus("PUBLISHED");
        return event;
    }

    private Booking booking(Long id, User user, Event event, LocalDateTime bookingDate, String status) {
        Booking booking = new Booking();
        booking.setId(id);
        booking.setUser(user);
        booking.setEvent(event);
        booking.setTicketCount(1);
        booking.setBookingDate(bookingDate);
        booking.setStatus(status);
        return booking;
    }
}
