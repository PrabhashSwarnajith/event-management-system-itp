package com.eventmanagement.backend.config;

import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;

    @Override
    public void run(String... args) {
        User adminUser = userRepository.findByEmail("admin@unievents.local").orElseGet(() -> {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@unievents.local");
            admin.setPassword(BCrypt.hashpw("Admin@12345", BCrypt.gensalt()));
            admin.setRole("ADMIN");
            return userRepository.save(admin);
        });

        if (venueRepository.count() == 0) {
            Venue venue1 = new Venue();
            venue1.setName("Main Auditorium");
            venue1.setLocation("Building A, Ground Floor");
            venue1.setCapacity(500);
            venue1.setDescription("Large hall for main uni events, guest lectures, and ceremonies.");
            venue1.setAmenities("Projector, Sound System, Stage, AC");
            venue1.setImageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80");
            venue1 = venueRepository.save(venue1);

            Venue venue2 = new Venue();
            venue2.setName("Student Union Lounge");
            venue2.setLocation("Student Center");
            venue2.setCapacity(100);
            venue2.setDescription("Casual space for club meetings and small gatherings.");
            venue2.setAmenities("WiFi, Couches, Whiteboard, Coffee Machine");
            venue2.setImageUrl("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80");
            venue2 = venueRepository.save(venue2);

            Venue venue3 = new Venue();
            venue3.setName("Computer Lab 304");
            venue3.setLocation("IT Faculty, 3rd Floor");
            venue3.setCapacity(40);
            venue3.setDescription("Fully equipped computer lab for technical workshops.");
            venue3.setAmenities("Computers, Projector, High-speed Internet");
            venue3.setImageUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80");
            venue3 = venueRepository.save(venue3);

            if (eventRepository.count() == 0) {
                Event event1 = new Event();
                event1.setTitle("Welcome Freshman Orientation");
                event1.setDescription("Welcome all new students! Learn about uni life, clubs, and campus facilities.");
                event1.setVenue(venue1);
                event1.setCategory("Orientation");
                event1.setEventDate(LocalDateTime.now().plusDays(10));
                event1.setCapacity(450);
                event1.setOrganizerId(adminUser.getId());
                event1.setBannerUrl("https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80");
                eventRepository.save(event1);

                Event event2 = new Event();
                event2.setTitle("Web Development Bootcamp");
                event2.setDescription("A beginner-friendly workshop on React and Spring Boot. Bring your own laptop or use the lab PCs.");
                event2.setVenue(venue3);
                event2.setCategory("Workshop");
                event2.setEventDate(LocalDateTime.now().plusDays(5));
                event2.setCapacity(40);
                event2.setOrganizerId(adminUser.getId());
                event2.setBannerUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80");
                eventRepository.save(event2);
                
                Event event3 = new Event();
                event3.setTitle("Anime Club Meetup");
                event3.setDescription("Weekly watch party and discussion. Snacks provided!");
                event3.setVenue(venue2);
                event3.setCategory("Club Meeting");
                event3.setEventDate(LocalDateTime.now().plusDays(2));
                event3.setCapacity(30);
                event3.setOrganizerId(adminUser.getId());
                event3.setBannerUrl("https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80");
                eventRepository.save(event3);
            }
        }
    }
}
