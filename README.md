# 🎓 UniEvents — University Event Management System

> **ITP Group Assignment · SLIIT · IT21 Batch**  
> Full-Stack Web Application | React + Spring Boot | 5 Members

---

## 👥 Team Members & Features

| Member | Student ID | Name | Module | Unique Feature |
|--------|-----------|------|--------|----------------|
| 1 | IT21001 | Prabhash Swarnajith | User & System Management | Full CRUD + **CSV/PDF Report Generation** |
| 2 | IT21002 | Ashan Perera | Event Management | **QR Code Ticket** generation after booking |
| 3 | IT21003 | Dilhani Fernando | Venue Management | **Live Chat** support widget |
| 4 | IT21004 | Ruwan Bandara | Booking & Payments | **Payment Gateway** (Stripe-like) |
| 5 | IT21005 | Kasun Rajapaksa | Reviews & Ratings | **Star Ratings** + Admin Analytics Charts |

---

## 🌟 Key Features

### 🔐 Authentication
- Email + Password login/signup with JWT
- **Google Sign-In** (OAuth demo)
- Role-based access: `ADMIN` vs `ATTENDEE`
- Secure BCrypt password hashing

### 🤖 AI Chatbot
- Smart event assistant with keyword-based NLP
- Covers: bookings, payments, venues, events, reviews
- Floating widget available on all pages

### 💬 Live Chat
- Real-time feel support chat widget
- Auto-replies with context-aware responses
- Message persistence (localStorage)
- Typing indicators

### 💳 Payment Gateway
- Stripe-like card payment UI
- Card brand detection (VISA/Mastercard)
- Test cards: `4242 4242 4242 4242` (success) | `4000 0000 0000 0002` (decline)
- Payment method toggle: Card / Bank Transfer

### 🎫 QR Tickets (Member 2)
- Auto-generated QR code after successful payment + booking
- QR contains booking ID, event, attendee name, transaction ID
- Viewable in My Bookings

### 🗺️ Venue Map View (Member 3)
- Live chat support for venue queries
- 5 campus venues with full details

### 📊 Analytics Charts (Member 5)
- Bar chart: Bookings per Event
- Pie charts: Event categories, Booking status, User roles
- Powered by Recharts

### 📋 Reports (Member 1)
- CSV export: Users, Events, Venues, Bookings
- Executive Summary Report
- UTF-8 BOM encoding for Excel compatibility

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven
- Node.js 18+

### Run the Application

```powershell
# From project root — starts both servers
.\start.ps1
```

Or manually:

```powershell
# Terminal 1 — Backend
cd backend
mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Access
| URL | Description |
|-----|-------------|
| http://localhost:5173 | Frontend App |
| http://localhost:8080 | Backend API |
| http://localhost:8080/h2-console | H2 Database Console |

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@unievents.lk | Admin@12345 |
| Student | ashan@unievents.lk | Ashan@12345 |
| Student | dilhani@unievents.lk | Dilhani@12345 |
| Student | ruwan@unievents.lk | Ruwan@12345 |
| Student | kasun@unievents.lk | Kasun@12345 |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Spring Boot 3 + Spring Security |
| Auth | JWT + BCrypt |
| Database | H2 (in-memory, auto-seeded) |
| UI Library | Lucide Icons + Recharts |
| QR Code | react-qr-code |

---

## 🌿 Git Branch Structure

```
main
├── feature/user-management      → Prabhash (IT21001)
├── feature/event-management     → Ashan (IT21002)
├── feature/venue-management     → Dilhani (IT21003)
├── feature/booking-management   → Ruwan (IT21004)
└── feature/reviews-ratings      → Kasun (IT21005)
```

### Setup Branches
```powershell
.\setup-branches.ps1
```

---

## 📁 Project Structure

```
event-management-system-itp/
├── backend/                    # Spring Boot API
│   └── src/main/java/.../
│       ├── controller/         # REST endpoints
│       ├── model/              # JPA entities
│       ├── repository/         # Spring Data repos
│       ├── service/            # Business logic
│       ├── security/           # JWT filter
│       └── config/             # Security + DataInitializer
├── frontend/                   # React + Vite
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── AIChatbot.jsx   # AI chatbot widget
│       │   ├── LiveChat.jsx    # Live support chat
│       │   ├── PaymentModal.jsx# Payment gateway
│       │   └── events/         # Event-specific components
│       │       └── EventReviews.jsx
│       ├── pages/              # Route-level pages
│       ├── context/            # React Context (Auth)
│       ├── hooks/              # Custom hooks
│       └── utils/              # Helper utilities
├── start.ps1                   # Quick start script
└── setup-branches.ps1          # Git branch setup
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/signup` | Register | Public |
| GET | `/api/events` | List events | Public |
| POST | `/api/events` | Create event | Admin |
| GET | `/api/venues` | List venues | Public |
| POST | `/api/bookings` | Book event | Authenticated |
| GET | `/api/bookings/my-bookings` | My bookings | Authenticated |
| GET | `/api/reviews/event/{id}` | Event reviews | Public |
| POST | `/api/reviews` | Submit review | Authenticated |
| POST | `/api/payments/process` | Process payment | Authenticated |
| POST | `/api/chatbot/message` | AI chatbot | Public |
| GET | `/api/admin/dashboard-stats` | System stats | Admin |
| GET | `/api/admin/users` | All users | Admin |

---

*Built for ITP Group Assignment — SLIIT Information Technology Programme*
