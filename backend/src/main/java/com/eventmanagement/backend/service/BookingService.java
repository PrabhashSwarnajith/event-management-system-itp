package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.BookingRequest;
import com.eventmanagement.backend.dto.BookingTicketResponse;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        Integer bookedTickets = bookingRepository.countConfirmedTicketsForEvent(event.getId());
        if (bookedTickets == null) bookedTickets = 0;

        int capacity = event.getCapacity() != null ? event.getCapacity() : event.getVenue().getCapacity();

        if (bookedTickets + request.getTicketCount() > capacity) {
            throw new IllegalArgumentException("Not enough tickets available. Remaining tickets: " + (capacity - bookedTickets));
        }

        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setTicketCount(request.getTicketCount());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserId(user.getId()).stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .toList();
    }

    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public BookingTicketResponse getTicket(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only view your own tickets");
        }

        return new BookingTicketResponse(
                booking.getId(),
                buildConfirmationCode(booking),
                booking.getEvent().getTitle(),
                booking.getEvent().getEventDate(),
                booking.getEvent().getVenue().getName(),
                booking.getUser().getName(),
                booking.getUser().getEmail(),
                booking.getTicketCount(),
                booking.getStatus(),
                booking.getBookingDate()
        );
    }

    private String buildConfirmationCode(Booking booking) {
        return "BK-" + booking.getId() + "-" + booking.getBookingDate().toLocalDate().toString().replace("-", "");
    }
}
