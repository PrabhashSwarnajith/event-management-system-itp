package com.eventmanagement.backend.config;

import com.eventmanagement.backend.model.*;
import com.eventmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DataInitializer — Seeds the in-memory H2 database with realistic sample data
 * for all 5 team member modules on application startup.
 *
 * Team members:
 *  1. Prabhash  — System Admin / User Management / Reports
 *  2. Ashan     — Event Management + QR Tickets
 *  3. Dilhani   — Venue Management + Map View
 *  4. Ruwan     — Booking & Payments + Timeline
 *  5. Kasun     — Reviews & Ratings + Analytics
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        seedVenuesAndEvents();
        seedBookings();
        seedReviews();
    }

    // ─── Users ───────────────────────────────────────────────────────────────────

    private void seedUsers() {
        // Admin — Member 1 (Prabhash)
        User admin = userRepository.findByEmail("admin@unievents.lk").orElseGet(() -> {
            User u = new User();
            u.setName("Prabhash Swarnajith");
            u.setEmail("admin@unievents.lk");
            u.setPassword(BCrypt.hashpw("Admin@12345", BCrypt.gensalt()));
            u.setRole("ADMIN");
            u.setStudentId("IT21001");
            u.setDepartment("Information Technology");
            return userRepository.save(u);
        });

        // Member 2 — Event manager (Ashan)
        userRepository.findByEmail("ashan@unievents.lk").orElseGet(() -> {
            User u = new User();
            u.setName("Ashan Perera");
            u.setEmail("ashan@unievents.lk");
            u.setPassword(BCrypt.hashpw("Ashan@12345", BCrypt.gensalt()));
            u.setRole("ATTENDEE");
            u.setStudentId("IT21002");
            u.setDepartment("Computer Science");
            return userRepository.save(u);
        });

        // Member 3 — Venue manager (Dilhani)
        userRepository.findByEmail("dilhani@unievents.lk").orElseGet(() -> {
            User u = new User();
            u.setName("Dilhani Fernando");
            u.setEmail("dilhani@unievents.lk");
            u.setPassword(BCrypt.hashpw("Dilhani@12345", BCrypt.gensalt()));
            u.setRole("ATTENDEE");
            u.setStudentId("IT21003");
            u.setDepartment("Software Engineering");
            return userRepository.save(u);
        });

        // Member 4 — Booking manager (Ruwan)
        userRepository.findByEmail("ruwan@unievents.lk").orElseGet(() -> {
            User u = new User();
            u.setName("Ruwan Bandara");
            u.setEmail("ruwan@unievents.lk");
            u.setPassword(BCrypt.hashpw("Ruwan@12345", BCrypt.gensalt()));
            u.setRole("ATTENDEE");
            u.setStudentId("IT21004");
            u.setDepartment("Information Systems");
            return userRepository.save(u);
        });

        // Member 5 — Reviews (Kasun)
        userRepository.findByEmail("kasun@unievents.lk").orElseGet(() -> {
            User u = new User();
            u.setName("Kasun Rajapaksa");
            u.setEmail("kasun@unievents.lk");
            u.setPassword(BCrypt.hashpw("Kasun@12345", BCrypt.gensalt()));
            u.setRole("ATTENDEE");
            u.setStudentId("IT21005");
            u.setDepartment("Computer Engineering");
            return userRepository.save(u);
        });

        // Extra demo students
        createStudentIfNotExists("Nimal Gamage",     "nimal@unievents.lk",    "IT21006", "Business IT");
        createStudentIfNotExists("Saman Silva",      "saman@unievents.lk",    "IT21007", "Computer Science");
        createStudentIfNotExists("Chathu Wickrama",  "chathu@unievents.lk",   "IT21008", "Software Engineering");
        createStudentIfNotExists("Thilini Rathnayake","thilini@unievents.lk", "IT21009", "Information Technology");
        createStudentIfNotExists("Malith Karunarathna","malith@unievents.lk", "IT21010", "Data Science");
    }

    private void createStudentIfNotExists(String name, String email, String sid, String dept) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(BCrypt.hashpw("Student@12345", BCrypt.gensalt()));
            u.setRole("ATTENDEE");
            u.setStudentId(sid);
            u.setDepartment(dept);
            return userRepository.save(u);
        });
    }

    // ─── Venues & Events ─────────────────────────────────────────────────────────

    private void seedVenuesAndEvents() {
        if (venueRepository.count() > 0) return;

        User admin = userRepository.findByEmail("admin@unievents.lk").orElseThrow();

        // ── Venues (Member 3 — Dilhani) ───────────────────────────────────────
        Venue v1 = saveVenue("Main Auditorium",
                "Building A, Ground Floor", 500,
                "Large hall for main university events, guest lectures, and convocation ceremonies.",
                "Projector, Sound System, Stage, AC, Lighting Rig, Backstage Area",
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80");

        Venue v2 = saveVenue("Student Union Lounge",
                "Student Center, Level 1", 100,
                "A relaxed, multi-purpose space ideal for club meetings, study sessions, and social events.",
                "WiFi, Couches, Whiteboard, Coffee Machine, TV Screen",
                "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80");

        Venue v3 = saveVenue("Computer Lab 304",
                "IT Faculty, 3rd Floor", 40,
                "Fully equipped computer lab with high-performance workstations — ideal for technical workshops.",
                "40x PCs, Projector, High-speed Internet, Smart Board",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80");

        Venue v4 = saveVenue("Open Air Amphitheatre",
                "Campus Garden, East Wing", 300,
                "Stunning outdoor venue surrounded by greenery — perfect for cultural shows, music events, and outdoor screenings.",
                "Open Stage, Power Supply, Lawn Seating, Sound System",
                "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80");

        Venue v5 = saveVenue("Conference Room 101",
                "Administration Building, 1st Floor", 60,
                "Professional conference room with executive setup — suitable for seminars, panels, and board meetings.",
                "Conference Table, Projector, Video Conferencing, Whiteboard, AC",
                "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=800&q=80");

        // ── Events (Member 2 — Ashan) ─────────────────────────────────────────
        if (eventRepository.count() > 0) return;

        saveEvent("Welcome Freshman Orientation 2025",
                "Welcome all new students to SLIIT! Get to know the campus, explore clubs, and meet your batch mates. Includes campus tour and faculty presentations.",
                v1, "Orientation", LocalDateTime.now().plusDays(12), 400, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80");

        saveEvent("Web Development Bootcamp — React & Spring Boot",
                "A 3-hour hands-on workshop covering React 18 frontend + Spring Boot 3 backend integration. Build a full-stack mini project. Bring your own laptop.",
                v3, "Workshop", LocalDateTime.now().plusDays(5), 40, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80");

        saveEvent("Anime & Manga Club Meetup — Season Finale Watch Party",
                "Weekly club session — this week we're watching the season finale of Demon Slayer. Snacks provided! Cosplay encouraged.",
                v2, "Club Meeting", LocalDateTime.now().plusDays(3), 30, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80");

        saveEvent("Annual Cultural Night 2025 — Colours of Sri Lanka",
                "Join us for a spectacular night celebrating Sri Lankan culture through traditional dance, music, food stalls, and art exhibitions.",
                v4, "Cultural", LocalDateTime.now().plusDays(20), 250, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80");

        saveEvent("AI & Machine Learning Symposium",
                "Industry experts present the latest trends in AI, deep learning, and NLP. Includes live demos and Q&A. Open to all IT students.",
                v1, "Academic", LocalDateTime.now().plusDays(8), 450, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80");

        saveEvent("Entrepreneurship Pitch Competition",
                "Present your startup idea to a panel of industry judges. Top 3 teams win cash prizes and mentorship. Registration required.",
                v5, "Competition", LocalDateTime.now().plusDays(15), 55, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80");

        saveEvent("Cyber Security Awareness Workshop",
                "Learn about ethical hacking, phishing attacks, and how to protect yourself online. Hands-on CTF challenges included.",
                v3, "Workshop", LocalDateTime.now().plusDays(7), 40, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80");

        saveEvent("Photography Club — Sunset Shoot Event",
                "Join the Photography Club for a guided sunset shoot around campus. DSLR, mirrorless, or phone — all are welcome. Light refreshments provided.",
                v4, "Club Meeting", LocalDateTime.now().plusDays(2), 30, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80");

        saveEvent("Hackathon 2025 — Code for Good",
                "48-hour hackathon with a focus on social impact solutions. Form teams of 3-5. Prizes worth Rs. 500,000. Meals and accommodation included.",
                v1, "Competition", LocalDateTime.now().plusDays(25), 500, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80");

        saveEvent("Fitness & Mental Health Awareness Day",
                "A full day event with yoga sessions, motivational talks, and mental health panels. Free participation, open to all students and staff.",
                v4, "Health & Wellness", LocalDateTime.now().plusDays(18), 200, admin, "PUBLISHED",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80");
    }

    private Venue saveVenue(String name, String location, int capacity,
                             String description, String amenities, String imageUrl) {
        Venue v = new Venue();
        v.setName(name);
        v.setLocation(location);
        v.setCapacity(capacity);
        v.setDescription(description);
        v.setAmenities(amenities);
        v.setImageUrl(imageUrl);
        v.setAvailable(true);
        return venueRepository.save(v);
    }

    private void saveEvent(String title, String description, Venue venue, String category,
                           LocalDateTime date, int capacity, User organizer, String status, String bannerUrl) {
        Event e = new Event();
        e.setTitle(title);
        e.setDescription(description);
        e.setVenue(venue);
        e.setCategory(category);
        e.setEventDate(date);
        e.setCapacity(capacity);
        e.setOrganizerId(organizer.getId());
        e.setStatus(status);
        e.setBannerUrl(bannerUrl);
        eventRepository.save(e);
    }

    // ─── Bookings (Member 4 — Ruwan) ─────────────────────────────────────────────

    private void seedBookings() {
        if (bookingRepository.count() > 0) return;

        List<Event> events = eventRepository.findAll();
        List<User> students = userRepository.findAll().stream()
                .filter(u -> "ATTENDEE".equals(u.getRole()))
                .toList();

        if (events.isEmpty() || students.isEmpty()) return;

        // Each student books 2-3 events
        int eventCount = events.size();
        for (int i = 0; i < students.size(); i++) {
            User student = students.get(i);
            // Book event i and event (i+1)
            createBookingIfPossible(student, events.get(i % eventCount), 2, "CONFIRMED");
            createBookingIfPossible(student, events.get((i + 2) % eventCount), 1, "CONFIRMED");
        }

        // Add a few cancelled bookings for realistic data
        if (students.size() >= 2) {
            createBookingIfPossible(students.get(0), events.get(0), 1, "CANCELLED");
            createBookingIfPossible(students.get(1), events.get(1), 1, "CANCELLED");
        }
    }

    private void createBookingIfPossible(User user, Event event, int tickets, String status) {
        try {
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setTicketCount(tickets);
            booking.setStatus(status);
            bookingRepository.save(booking);
        } catch (Exception ignored) {
            // Skip if booking fails (e.g., capacity exceeded)
        }
    }

    // ─── Reviews (Member 5 — Kasun) ──────────────────────────────────────────────

    private void seedReviews() {
        if (reviewRepository.count() > 0) return;

        List<Event> events = eventRepository.findAll();
        List<User> students = userRepository.findAll().stream()
                .filter(u -> "ATTENDEE".equals(u.getRole()))
                .toList();

        if (events.size() < 3 || students.size() < 3) return;

        String[][] reviewData = {
            {"Really well organised — loved the campus tour and the vibe!", "5"},
            {"Great workshop, learned so much about React hooks and Spring Security.", "5"},
            {"Very fun meetup! The watch party atmosphere was amazing.", "4"},
            {"Cultural night was breathtaking. The dance performances were incredible.", "5"},
            {"AI symposium was eye-opening. The NLP demo was my favourite part.", "4"},
            {"Pitch competition was intense but fair. Judges gave great feedback.", "4"},
            {"The CTF challenges were really well designed. Learned a lot about SQL injection.", "5"},
            {"Beautiful sunset photos. The club members were super welcoming!", "4"},
            {"48 hours of coding — exhausting but totally worth it. Won 2nd place!", "5"},
            {"Great wellness event. Yoga at sunrise was a highlight.", "4"}
        };

        int eventCount = Math.min(events.size(), reviewData.length);
        for (int i = 0; i < eventCount; i++) {
            User reviewer = students.get(i % students.size());
            Event event = events.get(i);

            // Skip if this user already reviewed this event
            boolean alreadyReviewed = reviewRepository.findByEventId(event.getId())
                    .stream().anyMatch(r -> r.getUserId().equals(reviewer.getId()));
            if (alreadyReviewed) continue;

            Review review = Review.builder()
                    .eventId(event.getId())
                    .userId(reviewer.getId())
                    .rating(Integer.parseInt(reviewData[i][1]))
                    .comment(reviewData[i][0])
                    .build();
            reviewRepository.save(review);
        }
    }
}
