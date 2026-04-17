# Event Management System - Implementation Plan

## 1. Project Overview

This project is a full-stack Event Management System for university events. It allows users to sign up, log in, browse events, and lets organizers create and manage events. The final version should also include venue management, booking/ticketing, payments, reviews, and an admin dashboard.

The current codebase already contains a working React frontend, a Spring Boot backend, H2 database setup, authentication endpoints, and event CRUD APIs.

## 2. Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- Fetch API for backend communication

### Backend
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Validation
- Lombok
- BCrypt password hashing
- H2 database for local development

### Future/Production Improvements
- Spring Security with JWT
- MySQL database
- File upload support for banners, venue images, tickets, and documents
- Role-based API protection

## 3. Current Project Status

### Completed
- Base React + Vite frontend setup
- Tailwind CSS setup
- Spring Boot backend setup
- H2 database configuration
- Global backend exception handling
- CORS configuration for local frontend
- User signup
- User login
- Password hashing with BCrypt
- Basic localStorage auth state on frontend
- Profile page with logout
- Event model, repository, service, and controller
- Event create, read, update, delete backend APIs
- Event search by title/category
- Frontend event listing page
- Frontend event creation page
- Frontend event detail page
- Frontend event update and delete actions
- Frontend event filters by category, date, and location
- Venue model, repository, service, controller, and DTO
- Venue CRUD APIs
- Venue listing and management pages
- Venue filters by location, capacity, and amenities
- Booking model, repository, service, controller, and DTO
- Ticket booking from event details page
- Capacity validation before confirming bookings
- My bookings page with upcoming, past, and cancelled sections
- Booking cancellation
- Simple booking confirmation API and frontend ticket view

### Partially Completed
- Event document/banner handling uses URL fields, not real file uploads.
- Ticket confirmation is displayed in the app, but it is not exported as a PDF yet.

### Not Yet Implemented
- Payment flow
- Reviews and ratings
- Admin dashboard
- PDF ticket/receipt generation
- MySQL production profile

## 4. Existing Backend API Summary

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Events
- `POST /api/events`
- `GET /api/events`
- `GET /api/events?search={query}`
- `GET /api/events/{id}`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`

### Venues
- `POST /api/venues`
- `GET /api/venues`
- `GET /api/venues/{id}`
- `PUT /api/venues/{id}`
- `DELETE /api/venues/{id}`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/my-bookings`
- `GET /api/bookings/{id}/ticket`
- `PUT /api/bookings/{id}/cancel`

## 5. Member Roles and Responsibilities

### Member 1: Identity and User Management

Responsibilities:
- Replace the simple pseudo-token with JWT authentication.
- Add Spring Security configuration.
- Protect APIs based on logged-in user and role.
- Add profile update API.
- Add frontend profile edit form.
- Support roles: `ADMIN`, `ORGANIZER`, `ATTENDEE`.

Suggested files/modules:
- `backend/src/main/java/.../controller/AuthController.java`
- `backend/src/main/java/.../service/AuthService.java`
- `backend/src/main/java/.../model/User.java`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/AuthPage.jsx`
- `frontend/src/pages/ProfilePage.jsx`

### Member 2: Event Management

Responsibilities:
- Complete event management UI.
- Add edit event form.
- Add delete event action.
- Add event detail page.
- Improve search/filtering by category, date, and location.
- Restrict event create/update/delete to organizers/admins.
- Connect events to venues once venue module is ready.

Suggested files/modules:
- `backend/src/main/java/.../controller/EventController.java`
- `backend/src/main/java/.../service/EventService.java`
- `backend/src/main/java/.../model/Event.java`
- `frontend/src/pages/EventsPage.jsx`
- `frontend/src/pages/ManageEvents.jsx`
- `frontend/src/components/EventCard.jsx`

### Member 3: Venue Management

Responsibilities:
- Create Venue entity, repository, service, controller, and DTOs.
- Add venue CRUD APIs.
- Add venue search/filtering by location, capacity, and amenities.
- Add venue availability check for event dates.
- Build frontend pages for listing and managing venues.

Suggested new backend modules:
- `model/Venue.java`
- `repository/VenueRepository.java`
- `service/VenueService.java`
- `controller/VenueController.java`
- `dto/VenueRequest.java`

Suggested frontend pages:
- `frontend/src/pages/VenuesPage.jsx`
- `frontend/src/pages/ManageVenues.jsx`

### Member 4: Booking and Ticketing Management

Responsibilities:
- Create Booking entity, repository, service, controller, and DTOs.
- Allow attendees to book tickets for events.
- Validate event capacity before confirming a booking.
- Allow users to view upcoming and past bookings.
- Allow booking cancellation.
- Generate simple booking confirmation/ticket document.

Suggested new backend modules:
- `model/Booking.java`
- `repository/BookingRepository.java`
- `service/BookingService.java`
- `controller/BookingController.java`
- `dto/BookingRequest.java`

Suggested frontend pages:
- `frontend/src/pages/BookingsPage.jsx`
- `frontend/src/pages/EventDetailsPage.jsx`

### Member 5: Payments, Reviews, and Admin Dashboard

Responsibilities:
- Add mock payment flow for bookings.
- Store payment records and payment status.
- Generate simple receipt data.
- Add event reviews and ratings.
- Build admin dashboard summary cards.
- Show total users, events, bookings, and revenue.

Suggested new backend modules:
- `model/Payment.java`
- `model/Review.java`
- `repository/PaymentRepository.java`
- `repository/ReviewRepository.java`
- `service/PaymentService.java`
- `service/ReviewService.java`
- `controller/PaymentController.java`
- `controller/ReviewController.java`
- `controller/AdminController.java`

Suggested frontend pages:
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/PaymentPage.jsx`
- `frontend/src/components/ReviewSection.jsx`

## 6. Recommended Implementation Order

1. Stabilize current auth and event modules.
2. Add JWT and role-based authorization.
3. Complete event update/delete/detail pages.
4. Add venue management.
5. Link events to venues.
6. Add booking and capacity validation.
7. Add mock payments.
8. Add reviews and ratings.
9. Add admin dashboard.
10. Add final testing, validation, and documentation.

## 7. Git Branching Strategy

Use a feature branch workflow. The `main` branch should remain stable and working.

Recommended branches and GitHub accounts:
- `feature/member1-auth` - Prabhash
- `feature/member2-events` - IT21012624
- `feature/member3-venues` - it23677296-ayesha
- `feature/member4-bookings` - Shehani03
- `feature/member5-admin-payments` - prabash

Workflow:

```bash
git checkout main
git pull origin main
git checkout -b feature/member-name-module
```

After finishing a feature:

```bash
git add .
git commit -m "Implement module name"
git push -u origin feature/member-name-module
```

Then create a pull request into `main`.

## 8. Testing Checklist

Backend:
- Run `mvn test` inside the `backend` folder.
- Test all API endpoints with Postman or frontend flows.
- Verify validation errors return useful responses.
- Verify unauthorized users cannot access protected actions after JWT is added.

Frontend:
- Run `npm run build` inside the `frontend` folder.
- Test login, signup, logout, and profile view.
- Test event create and event listing.
- Test all new pages on desktop and mobile screen sizes.

## 9. Known Issues to Fix

- README says Webpack, but the frontend uses Vite.
- Current auth token is not a real JWT.
- `@CrossOrigin(origins = "*")` in controllers should be replaced by centralized CORS configuration only.
- Backend event create/update/delete is not role-protected until Spring Security/JWT is added.
- Placeholder pages for venues, bookings, and admin dashboard need real implementations.
- Backend debug/SQL logging may be too noisy for final submission.

## 10. Final Submission Goals

The final project should demonstrate:
- Secure user authentication
- Role-based access
- Event CRUD
- Venue CRUD
- Booking and ticketing
- Capacity validation
- Mock payment flow
- Reviews and ratings
- Admin dashboard
- Clean frontend navigation
- Working backend APIs
- Clear README setup instructions
