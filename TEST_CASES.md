# UniEvents Test Cases Document

## Project Details

| Field | Details |
| --- | --- |
| Project | UniEvents - University Event Management System |
| Module Covered | Backend service layer |
| Test Framework | JUnit 5, Mockito, AssertJ, Spring Boot Test |
| Test Command | `cd backend && mvn test` |
| Latest Test Result | 29 tests passed, 0 failures |

## Scope

This document covers automated backend test cases for authentication, event management, venue management, booking management, and application startup. These tests verify core business rules such as user registration, password validation, event venue conflict checks, venue filtering, venue availability, ticket capacity checks, booking ownership, and ticket generation.

## Test Environment

| Item | Value |
| --- | --- |
| Backend Framework | Spring Boot 3 |
| Language | Java 17+ |
| Database | H2 in-memory database for application context test |
| Build Tool | Maven |
| Test Location | `backend/src/test/java/com/eventmanagement/backend` |

## Test Case Summary

| Test Suite | Number of Test Cases | Purpose |
| --- | ---: | --- |
| `EventManagementApplicationTests` | 1 | Verifies Spring application context loads |
| `AuthServiceTest` | 6 | Verifies login, signup, duplicate email, and Google login behavior |
| `BookingServiceTest` | 8 | Verifies booking creation, capacity checks, cancellation, and ticket details |
| `EventServiceTest` | 6 | Verifies event creation, status handling, search, filtering, and venue clashes |
| `VenueServiceTest` | 8 | Verifies venue creation, filtering, availability, updates, and deletion |
| Total | 29 | Backend service and context coverage |

## Detailed Test Cases

### Application Context

| Test ID | Test Case | Preconditions | Test Data | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-APP-001 | Verify application context loads successfully | Spring Boot application configuration is available | None | Application context starts without errors | Passed |

### Authentication Service

| Test ID | Test Case | Preconditions | Test Data | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-AUTH-001 | Register a new attendee account | Email is not already registered | Name: Nimal Perera, Email: `nimal@unievents.lk`, Password: `Student@12345` | User is saved with role `ATTENDEE`, password is hashed, and auth token is returned | Passed |
| TC-AUTH-002 | Reject signup for duplicate email | Email already exists in repository | Email: `duplicate@unievents.lk` | `AuthException` is thrown with message `Email is already registered`; user is not saved | Passed |
| TC-AUTH-003 | Login with valid credentials | User exists with matching BCrypt password | Email: `ayesha@unievents.lk`, Password: `Student@12345` | Auth response returns generated token and user details | Passed |
| TC-AUTH-004 | Reject login with incorrect password | User exists, password does not match | Email: `student@unievents.lk`, Password: `WrongPassword1` | `AuthException` is thrown with message `Invalid email or password` | Passed |
| TC-AUTH-005 | Create attendee through Google login when email is new | Google email does not exist in repository | Email: `google@unievents.lk`, Name: Google Student | New attendee user is saved and auth token is returned | Passed |
| TC-AUTH-006 | Reject Google login when email is missing | Google profile does not contain email | Name: Missing Email | `AuthException` is thrown with message `Google account email is required` | Passed |

### Booking Service

| Test ID | Test Case | Preconditions | Test Data | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-BOOK-001 | Create booking when tickets are available | User and event exist; remaining capacity is enough | Event capacity: 10, confirmed tickets: 6, requested tickets: 3 | Booking is saved with status `CONFIRMED` | Passed |
| TC-BOOK-002 | Use venue capacity when event capacity is missing | Event capacity is null, venue capacity is available | Venue capacity: 6, confirmed tickets: 4, requested tickets: 2 | Booking is accepted using venue capacity | Passed |
| TC-BOOK-003 | Reject booking when capacity is exceeded | User and event exist; requested tickets exceed remaining seats | Event capacity: 5, confirmed tickets: 4, requested tickets: 2 | `IllegalArgumentException` is thrown with remaining ticket message | Passed |
| TC-BOOK-004 | Reject booking when user does not exist | No user found for supplied email | Email: `missing@unievents.lk` | `ResourceNotFoundException` is thrown with message `User not found` | Passed |
| TC-BOOK-005 | Return user bookings newest first | User has multiple bookings with different booking dates | Older booking: 2026-05-01, newer booking: 2026-05-03 | Bookings are sorted in descending booking date order | Passed |
| TC-BOOK-006 | Cancel booking by owner | Booking exists and belongs to logged-in user | Booking owner email: `owner@unievents.lk` | Booking status changes to `CANCELLED` and booking is saved | Passed |
| TC-BOOK-007 | Reject booking cancellation by non-owner | Booking exists but belongs to another user | Owner: `owner@unievents.lk`, requester: `other@unievents.lk` | `IllegalArgumentException` is thrown with ownership message | Passed |
| TC-BOOK-008 | Return ticket details for booking owner | Booking exists and belongs to logged-in user | Booking ID: 60, date: 2026-05-03, ticket count: 4 | Ticket response includes confirmation code `BK-60-20260503`, event, venue, attendee, and ticket details | Passed |

### Event Service

| Test ID | Test Case | Preconditions | Test Data | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-EVENT-001 | Create event with blank status | Venue exists and no venue clash exists | Title: Tech Talk, Status: null | Event is saved with default status `PUBLISHED` | Passed |
| TC-EVENT-002 | Reject active event when venue has clash | Venue already has another non-cancelled event at same date/time | Venue ID: 3, Status: `DRAFT` | `IllegalArgumentException` is thrown with venue clash message | Passed |
| TC-EVENT-003 | Allow cancelled event without clash check | Event status is cancelled | Status: `cancelled` | Event is saved with normalized status `CANCELLED` | Passed |
| TC-EVENT-004 | Filter events by organizer, search text, and status | Organizer has several events | Search: `tech`, Organizer ID: 99, Status: `published` | Only matching published tech event is returned | Passed |
| TC-EVENT-005 | Reject request for missing event ID | Event does not exist | Event ID: 404 | `ResourceNotFoundException` is thrown with message `Event not found with ID: 404` | Passed |
| TC-EVENT-006 | Search events by category when title has no matches | No title matches exist; category match exists | Query: `sports` | Matching category event is returned | Passed |

### Venue Service

| Test ID | Test Case | Preconditions | Test Data | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-VENUE-001 | Create venue with default availability | Availability is not provided in request | Name: Main Auditorium, Location: Colombo Campus, Capacity: 250 | Venue is saved with availability set to `true` | Passed |
| TC-VENUE-002 | Create unavailable venue | Availability is provided as false | Name: Seminar Hall, Location: Engineering Faculty, Capacity: 80, Available: `false` | Venue is saved with availability set to `false` | Passed |
| TC-VENUE-003 | Filter venues by search, location, capacity, amenity, and availability | Repository contains multiple venues with different values | Search: `lab`, Location: `colombo`, Min capacity: 50, Amenity: `wifi`, Available: `true` | Only the venue matching all filters is returned | Passed |
| TC-VENUE-004 | Reject request for missing venue ID | Venue does not exist | Venue ID: 404 | `ResourceNotFoundException` is thrown with message `Venue not found with ID: 404` | Passed |
| TC-VENUE-005 | Check venue availability | Venue exists and is available | Venue ID: 6, Available: `true` | Service returns `true` | Passed |
| TC-VENUE-006 | Update venue details | Venue exists | Name: Updated Hall, Location: New Location, Capacity: 150, Available: `false` | Existing venue fields are updated and saved | Passed |
| TC-VENUE-007 | Delete existing venue | Venue exists | Venue ID: 8 | Venue repository deletes the venue by ID | Passed |
| TC-VENUE-008 | Reject deletion for missing venue | Venue does not exist | Venue ID: 404 | `ResourceNotFoundException` is thrown and delete is not called | Passed |

## Bug Fixed During Testing

| Issue | Fix |
| --- | --- |
| Google login with a missing email caused a `NullPointerException` before validation. | Updated `AuthService.googleLogin` to validate email before using it to build the default name. |

## How to Run Tests

```powershell
cd backend
mvn test
```

## Expected Maven Result

```text
Tests run: 29, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Test Files

| File | Description |
| --- | --- |
| `backend/src/test/java/com/eventmanagement/backend/EventManagementApplicationTests.java` | Spring Boot context load test |
| `backend/src/test/java/com/eventmanagement/backend/service/AuthServiceTest.java` | Authentication service unit tests |
| `backend/src/test/java/com/eventmanagement/backend/service/BookingServiceTest.java` | Booking service unit tests |
| `backend/src/test/java/com/eventmanagement/backend/service/EventServiceTest.java` | Event service unit tests |
| `backend/src/test/java/com/eventmanagement/backend/service/VenueServiceTest.java` | Venue service unit tests |
