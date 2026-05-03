# UniEvents - University Event Management System

ITP group assignment for SLIIT. UniEvents is a full-stack web app for discovering campus events, booking seats, managing venues, handling payments, generating QR tickets, collecting reviews, and supporting students.

## Team Members

| Member | Name | Main Area | Special Feature |
|--------|------|-----------|-----------------|
| 1 | Prabhash Swarnajith | Accounts, auth, users, reports | Google sign-in demo and role based auth |
| 2 | Shehani03 | FAQ, support content, about page | Smart help desk widget |
| 3 | it23677296-ayesha | Events, contact page, support flow | Live support chat |
| 4 | IT21012624 | Bookings and payments | Payment flow and QR ticket generator |
| 5 | PrabhashSwarnajith | Venues, reviews, legal pages | Countdown widget and dark mode |

## Main Features

- Login and signup with JWT and BCrypt password hashing.
- Role based access for protected system functions.
- Event listing, event details, booking flow, and student ticket history.
- Venue listing and venue management.
- Payment modal with card validation and QR ticket display.
- Live support chat with a two-section layout for members and messages.
- Help desk widget for quick questions.
- CSV reports for users, events, venues, bookings, and summary metrics.
- Static pages for Home, About Us, FAQ, Contact Us, Terms, and Privacy.

## Quick Start

### Prerequisites

- Java 17+
- Maven
- Node.js 18+

### Backend

```powershell
cd backend
mvn spring-boot:run
```

### Frontend

```powershell
cd frontend
npm run dev
```

## Local URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Frontend app |
| `http://localhost:8080` | Backend API |
| `http://localhost:8080/h2-console` | H2 database console |

## Demo Student Login

| Email | Password |
|-------|----------|
| `shehani03@unievents.lk` | `Student@12345` |
| `ayesha@unievents.lk` | `Student@12345` |
| `it21012624@unievents.lk` | `Student@12345` |
| `prabhashswarnajith@unievents.lk` | `Student@12345` |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Spring Boot 3, Spring Security |
| Auth | JWT, BCrypt |
| Database | H2 in-memory database |
| UI | Lucide Icons, Recharts |
| Tickets | react-qr-code |

## Branches

- `main`
- `member1-prabhash`
- `member2-shehani`
- `member3-ayesha`
- `member4-it21012624`
- `member5-prabhashswarnajith`

Run the helper to create any missing local branch:

```powershell
.\setup-branches.ps1
```

## Project Structure

```text
event-management-system-itp/
  backend/
    src/main/java/com/eventmanagement/backend/
      controller/
      model/
      repository/
      service/
      security/
      config/
  frontend/
    src/
      components/
        admin/
        bookings/
        chat/
        events/
        home/
        profile/
        ui/
      pages/
        admin/
        auth/
        events/
        info/
        user/
      context/
      hooks/
      utils/
```

## Useful API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/signup` | Register |
| GET | `/api/events` | List events |
| GET | `/api/events/{id}` | Event details |
| GET | `/api/venues` | List venues |
| POST | `/api/bookings` | Book event |
| GET | `/api/bookings/my-bookings` | Current user's bookings |
| POST | `/api/payments/process` | Process payment |
| GET | `/api/reviews/event/{id}` | Event reviews |
| POST | `/api/reviews` | Submit review |

Built for the ITP group assignment.
