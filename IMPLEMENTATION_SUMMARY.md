# UniEvents - Complete Implementation Summary

## Project Overview

UniEvents is a full-stack university event management system built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.3.5 + Spring Security + H2 Database
- **Authentication**: JWT-based with Google OAuth demo
- **AI Integration**: Google Gemini API for smart help desk

---

## Recent Implementations ✅

### 1. **Live Chat Window - Privacy-Aware Design**

**What Changed**:
- Regular students see messages WITHOUT sender information
- Admin users see WHO sent each message with timestamps
- Support team sidebar only visible to admins

**Files Modified**:
- `frontend/src/components/chat/LiveChat.jsx`

**Feature Access**:
- Students: Open "Live Support" button → Simple message thread
- Admins: Same button → See sender names + support members list

---

### 2. **Chat Responsiveness - Full Mobile Support**

**What's Included**:

#### SmartHelp (Help Desk Widget)
```
Mobile (320-640px):   ┌─────────────┐
                      │ Help Desk ℹ │
                      └─────────────┘
                      Compact design, icon only

Tablet+ (640px+):     ┌──────────────────┐
                      │ Help Desk   ℹ    │
                      └──────────────────┘
                      Full text visible
```

#### LiveChat (Live Support)
```
Mobile:               ┌─────────┐
                      │ Support │
                      │ Chat    │
                      │ 100% ✓  │
                      └─────────┘

Tablet (640px+):      ┌──────────────┐
                      │Members │ Chat │
                      │        │ Msgs │
                      │        │ Inpt │
                      └──────────────┘
```

**Files Modified**:
- `frontend/src/components/chat/SmartHelp.jsx`
- `frontend/src/components/chat/LiveChat.jsx`

**Responsive Breakpoints**:
| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| Mobile | 320-640px | Phones |
| Tablet | 641-1024px | iPads, tablets |
| Desktop | 1025px+ | Computers |

---

### 3. **Venue Booking Feature**

**What's New**:
- Book Venue buttons on each venue card
- Sign In link if user not authenticated
- Only shows when venue is available
- Tailwind-styled with hover effects

**Files Modified**:
- `frontend/src/components/venues/VenueCard.jsx`
- `frontend/src/pages/events/VenuesPage.jsx`

**User Flow**:
```
Guest User:  Venues Page → Book Venue → Sign In
             
Logged User: Venues Page → Book Venue → [Ready to book]
```

---

### 4. **Event Ticketing System**

**Already Implemented**:
- Book tickets for events
- Select ticket quantity (1-10)
- Payment gateway modal
- QR code ticket generation
- View bookings in user profile

**Files**:
- `frontend/src/components/events/BookingPanel.jsx`
- `frontend/src/components/ui/PaymentModal.jsx`
- `frontend/src/pages/events/EventDetailsPage.jsx`

**User Flow**:
```
Browse Events → Select Event → Choose Tickets → Pay → Get QR Ticket
```

---

## Required API Keys & Setup

### 1. Google Gemini API Key (for Help Desk)

**Purpose**: Power the SmartHelp chatbot with AI responses

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project "UniEvents"
3. Enable "Generative Language API"
4. Create API Key
5. Copy key and add to `frontend/src/components/chat/SmartHelp.jsx`:

```javascript
// Line 3 in SmartHelp.jsx
const HELP_API_KEY = "AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX";
```

**Cost**: Free tier = 60 requests/minute

### 2. Google OAuth Client ID (for Login)

**Purpose**: Enable "Continue with Google" button

**Steps**:
1. Google Cloud Console → APIs & Services → OAuth consent screen
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized origins:
   - `http://localhost:5173`
   - `http://localhost:5175`
   - `https://yourdomain.com`
4. The demo uses simulated Google login with student accounts

**Current Setup**: Demo mode with 5 test accounts:
- shehani03@unievents.lk
- ayesha@unievents.lk
- it21012624@unievents.lk
- prabhashswarnajith@unievents.lk
- Custom accounts

---

## Running the Application

### Start Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Backend runs on**: `http://localhost:8080`

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

**Frontend runs on**: `http://localhost:5173` or next available port

### Test the App
1. Open `http://localhost:5173`
2. Click "Sign In" → Use demo credentials or Google
3. Browse Events → Select event → Book with tickets
4. Visit Venues → See booking buttons
5. Click "Help Desk" → Ask questions to AI
6. Click "Live Support" → Chat with team

---

## User Roles & Features

### Student/Guest
- ✅ View events and venues
- ✅ Book events (after login)
- ✅ Use Help Desk (AI chatbot)
- ✅ Use Live Support chat
- ✅ View own bookings
- ❌ Cannot see sender names in chat
- ❌ Cannot manage events/venues

### Admin
- ✅ All student features
- ✅ See who sent chat messages
- ✅ View support members list
- ✅ Access admin dashboard
- ✅ Manage events and venues

---

## File Structure

```
event-management-system-itp/
├── API_KEYS_SETUP.md           ← 📖 API configuration guide
├── RESPONSIVE_DESIGN.md        ← 📖 Mobile design documentation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── SmartHelp.jsx       ✅ AI Help Desk
│   │   │   │   └── LiveChat.jsx        ✅ Live Support (admin-aware)
│   │   │   ├── events/
│   │   │   │   ├── BookingPanel.jsx    ✅ Event booking UI
│   │   │   │   └── EventDetailsPage.jsx ✅ Event details + booking
│   │   │   └── venues/
│   │   │       └── VenueCard.jsx       ✅ Venue booking button
│   │   ├── pages/
│   │   │   ├── auth/AuthPage.jsx       ✅ Login + Google OAuth
│   │   │   └── events/VenuesPage.jsx   ✅ Venue listing
│   │   └── context/AuthContext.jsx
│   └── package.json
└── backend/
    ├── src/main/java/com/eventmanagement/
    │   ├── controller/
    │   │   ├── AuthController.java      ✅ Login/Signup
    │   │   ├── BookingController.java   ✅ Booking API
    │   │   └── ChatbotController.java   ✅ Chat responses
    │   └── service/
    │       ├── AuthService.java
    │       ├── BookingService.java
    │       └── ChatbotService.java
    └── pom.xml
```

---

## Responsive Design Summary

### Tailwind Breakpoints Used

```
Mobile First (default):  Styles for 320px+ devices
sm:                      640px+ devices (tablets)
md:                      768px+ devices (iPad, larger tablets)
lg:                      1024px+ devices (laptops, desktops)
```

### Key Responsive Features

✅ **Chat Windows**:
- Full viewport width on mobile
- Fixed width on desktop
- Responsive padding and text sizes
- Touch-friendly buttons (32-44px)

✅ **Messages**:
- 75% width on mobile (room for avatar)
- 80% width on desktop
- Responsive font sizes (text-xs → sm:text-sm)

✅ **Input Areas**:
- Compact on mobile (reduced padding)
- Spacious on desktop
- Always accessible without keyboard pushing it off-screen

---

## Commits Made (Team Attribution)

| Team Member | Commit | Feature |
|------------|--------|---------|
| it23677296-ayesha | Hide sender info in chat | Privacy-aware messaging |
| PrabhashSwarnajith | Add venue booking UI | Venue booking feature |
| Shehani03 | Responsive SmartHelp | Mobile help desk |
| it23677296-ayesha | Responsive LiveChat | Mobile live support |
| Prabhash Swarnajith | API Keys Setup Guide | Configuration docs |
| IT21012624 | Responsive Design Guide | Design documentation |

---

## Testing Checklist

### Desktop (1920×1080)
- [ ] All buttons visible and clickable
- [ ] Chat windows sized correctly
- [ ] Admin features working
- [ ] No horizontal scrolling

### Tablet (1024×768)
- [ ] Chat accessible with bottom navigation
- [ ] Messages display properly
- [ ] Buttons easily tappable
- [ ] No content overflow

### Mobile (375×667)
- [ ] Floating buttons in safe zone
- [ ] Full-screen chat window works
- [ ] Input field doesn't hide under keyboard
- [ ] Text readable without pinch-zoom

---

## Quick Start Commands

```bash
# Clone and setup
git clone <repo>
cd event-management-system-itp

# Backend
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Frontend (in new terminal)
cd frontend
npm install
npm run dev

# Open browser
http://localhost:5173
```

---

## Important Notes

⚠️ **API Keys**:
- Add Gemini API key to SmartHelp.jsx before using help desk
- Google OAuth is in demo mode (no real authentication needed)
- For production: Follow API_KEYS_SETUP.md

⚠️ **Demo Users**:
- All passwords: `Student@12345`
- Roles: STUDENT or ADMIN

⚠️ **Database**:
- Using H2 in-memory database
- Data resets on backend restart
- For production: Use PostgreSQL/MySQL

---

## Next Steps / Improvements

- [ ] Implement real Google OAuth
- [ ] Add production database
- [ ] Deploy to cloud (Heroku, AWS, GCP)
- [ ] Add payment processing (Stripe)
- [ ] Implement email notifications
- [ ] Add dark mode toggle
- [ ] Add multi-language support

---

## Support Resources

📖 **Documentation**:
- [API_KEYS_SETUP.md](API_KEYS_SETUP.md) - Google APIs configuration
- [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) - Mobile design guide
- [README.md](README.md) - Project overview

🔗 **External Links**:
- [Google Cloud Console](https://console.cloud.google.com/)
- [Gemini API Docs](https://ai.google.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

📧 **Contact**:
- Email: `support@unievents.lk`
- GitHub: `event-management-system-itp`

---

**Last Updated**: May 3, 2026
**Version**: 1.0.0
**Status**: ✅ Fully Responsive & Mobile-Ready
