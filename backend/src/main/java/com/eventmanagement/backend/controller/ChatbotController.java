package com.eventmanagement.backend.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * ChatbotController — AI Event Assistant (rule-based NLP simulation).
 * Member 2 (Ashan) feature: Smart FAQ chatbot that answers questions about events,
 * bookings, venues, and university life using keyword matching.
 *
 * In production this would integrate with OpenAI GPT or Google Gemini API.
 */
@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> processMessage(@RequestBody ChatMessage message) {
        String query = message.getMessage() == null ? "" : message.getMessage().toLowerCase().trim();
        String response = getResponse(query);

        Map<String, Object> result = new HashMap<>();
        result.put("message", response);
        result.put("timestamp", System.currentTimeMillis());
        result.put("type", getResponseType(query));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions() {
        return ResponseEntity.ok(List.of(
            "How do I book an event?",
            "What events are happening this week?",
            "How do I cancel my booking?",
            "What payment methods do you accept?",
            "Where is the Main Auditorium?",
            "How do I contact support?"
        ));
    }

    private String getResponse(String query) {
        // Booking-related
        if (contains(query, "book", "register", "sign up", "reserve", "ticket")) {
            return "📋 **How to Book an Event:**\n1. Browse Events from the main menu\n2. Click on your preferred event\n3. Select the number of tickets\n4. Click **Book Now** and proceed to payment\n5. You'll receive a confirmation with your QR ticket!\n\nNeed help? Type 'payment' to learn about payment options.";
        }

        // Payment
        if (contains(query, "payment", "pay", "card", "price", "cost", "fee", "charge")) {
            return "💳 **Payment Options:**\nWe accept:\n• Visa / Mastercard debit & credit cards\n• Bank transfers\n\n🔒 All payments are secured with 256-bit SSL encryption.\n\nTest card: **4242 4242 4242 4242** (any future expiry, any CVV)\nDecline test: **4000 0000 0000 0002**";
        }

        // Cancel
        if (contains(query, "cancel", "refund", "withdraw")) {
            return "❌ **Cancellation Policy:**\nYou can cancel bookings up to 24 hours before the event.\n\nTo cancel:\n1. Go to **My Bookings**\n2. Find your booking and click **Cancel**\n3. Cancellations within 48h are eligible for full refunds.\n\nRefunds are processed within 3-5 business days.";
        }

        // Venue / location
        if (contains(query, "venue", "location", "where", "hall", "auditorium", "lab", "room")) {
            return "📍 **Campus Venues:**\n• **Main Auditorium** — Building A, Ground Floor (capacity: 500)\n• **Student Union Lounge** — Student Center, Level 1 (capacity: 100)\n• **Computer Lab 304** — IT Faculty, 3rd Floor (capacity: 40)\n• **Open Air Amphitheatre** — Campus Garden, East Wing (capacity: 300)\n• **Conference Room 101** — Admin Building, 1st Floor (capacity: 60)\n\nVisit the Venues page for photos and directions 🗺️";
        }

        // Events
        if (contains(query, "event", "upcoming", "schedule", "when", "today", "this week")) {
            return "📅 **Upcoming Events:**\nCheck the **Events** page for a full list with filters by category, date, and venue.\n\nPopular categories:\n• 🎓 Orientation & Academic\n• 💻 Tech Workshops\n• 🎨 Cultural & Arts\n• 🏆 Competitions & Hackathons\n• 🌿 Health & Wellness";
        }

        // Contact / support
        if (contains(query, "contact", "help", "support", "email", "phone")) {
            return "📞 **Contact & Support:**\n• Email: support@unievents.lk\n• Phone: +94 11 234 5678\n• Office: Administration Building, Room 102\n• Hours: Mon–Fri, 8:30 AM – 5:00 PM\n\nOr use the **Live Chat** feature in the bottom-right corner for instant support!";
        }

        // QR code / ticket
        if (contains(query, "qr", "qr code", "ticket", "scan")) {
            return "🎫 **Your QR Tickets:**\nAfter a successful booking, a QR code is generated for your ticket.\n\n• View it under **My Bookings** → Click **View Ticket**\n• Show the QR code at the event entrance for check-in\n• Each QR code is unique to your booking and cannot be shared";
        }

        // Google / login
        if (contains(query, "google", "login", "sign in", "account", "password")) {
            return "🔐 **Sign In Options:**\n• **Email & Password** — Standard login\n• **Continue with Google** — Quick login using your Google account\n\nTo reset your password, contact support@unievents.lk with your student ID.";
        }

        // Reviews
        if (contains(query, "review", "rating", "feedback", "star")) {
            return "⭐ **Event Reviews:**\nAfter attending an event, you can leave a star rating (1–5 stars) and a written review.\n\nTo submit a review:\n1. Go to the event page\n2. Scroll to **Reviews & Ratings** section\n3. Select your stars and write your feedback\n\nYour review helps future attendees make informed decisions!";
        }

        // Hackathon / competition
        if (contains(query, "hackathon", "competition", "prize", "team")) {
            return "🏆 **Competitions & Hackathons:**\nWe host regular competitions including hackathons, pitch competitions, and coding challenges.\n\n• **Hackathon 2025** — 48-hour coding event, prizes worth Rs. 500,000!\n• Teams of 3–5 members\n• Meals and accommodation included\n\nRegister on the Events page before spots run out!";
        }

        // Greeting
        if (contains(query, "hello", "hi", "hey", "good morning", "good evening", "greetings")) {
            return "👋 **Hello! Welcome to UniEvents AI Assistant!**\n\nI'm here to help you with:\n• 📅 Event information & bookings\n• 📍 Venue details & directions\n• 💳 Payment & refund queries\n• 🎫 QR tickets & check-in\n• ⭐ Reviews & feedback\n\nWhat would you like to know?";
        }

        // Default fallback
        return "🤖 I'm not sure about that, but I'm happy to help with:\n\n• **Events** — Browse and book upcoming events\n• **Venues** — Find campus venues and their details\n• **Bookings** — Manage your reservations\n• **Payment** — Learn about payment methods\n• **Support** — Contact the events team\n\nTry asking something like *\"How do I book an event?\"* or *\"Where is the auditorium?\"*";
    }

    private boolean contains(String query, String... keywords) {
        for (String kw : keywords) {
            if (query.contains(kw)) return true;
        }
        return false;
    }

    private String getResponseType(String query) {
        if (contains(query, "book", "ticket", "register")) return "BOOKING";
        if (contains(query, "pay", "card", "fee")) return "PAYMENT";
        if (contains(query, "venue", "location", "where")) return "VENUE";
        if (contains(query, "event", "upcoming")) return "EVENT";
        return "GENERAL";
    }

    @Data
    public static class ChatMessage {
        private String message;
        private String sessionId;
    }
}
