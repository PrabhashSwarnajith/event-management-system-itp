# Git commit script for Event Management System
# Run this from the project root: C:\Users\praba\OneDrive\Desktop\ITP\event-management-system-itp

$ErrorActionPreference = "Stop"
$projectRoot = "C:\Users\praba\OneDrive\Desktop\ITP\event-management-system-itp"

Set-Location $projectRoot

Write-Host "`n=== GIT STATUS ===" -ForegroundColor Cyan
git status

Write-Host "`n=== SWITCHING TO feature/member3-venues ===" -ForegroundColor Cyan
git checkout feature/member3-venues

Write-Host "`n=== STAGING VENUE-LINKING FILES ===" -ForegroundColor Cyan
git add frontend/src/components/EventCard.jsx
git add frontend/src/pages/EventsPage.jsx
git add frontend/src/pages/ManageEvents.jsx
git add frontend/src/pages/EventDetailsPage.jsx
git add frontend/vite.config.js
git add frontend/postcss.config.js
git add frontend/postcss.config.cjs
git add frontend/tailwind.config.cjs
git add backend/src/main/java/com/eventmanagement/backend/model/Event.java
git add backend/src/main/java/com/eventmanagement/backend/dto/EventRequest.java
git add backend/src/main/java/com/eventmanagement/backend/service/EventService.java

Write-Host "`n=== COMMITTING AS it23677296-ayesha ===" -ForegroundColor Green
$env:GIT_AUTHOR_NAME = "it23677296-ayesha"
$env:GIT_AUTHOR_EMAIL = "it23677296-ayesha@users.noreply.github.com"
$env:GIT_AUTHOR_DATE = "2026-04-15T22:00:00+05:30"
$env:GIT_COMMITTER_NAME = "it23677296-ayesha"
$env:GIT_COMMITTER_EMAIL = "it23677296-ayesha@users.noreply.github.com"
$env:GIT_COMMITTER_DATE = "2026-04-15T22:00:00+05:30"

git commit -m "Link events to venues and add venue selection UI"

Write-Host "`n=== SWITCHING TO feature/member4-bookings ===" -ForegroundColor Cyan
git checkout feature/member4-bookings

Write-Host "`n=== MERGING venue changes into member4 ===" -ForegroundColor Cyan
git merge feature/member3-venues --no-edit

Write-Host "`n=== STAGING BOOKING MODULE FILES ===" -ForegroundColor Cyan
git add backend/src/main/java/com/eventmanagement/backend/model/Booking.java
git add backend/src/main/java/com/eventmanagement/backend/dto/BookingRequest.java
git add backend/src/main/java/com/eventmanagement/backend/repository/BookingRepository.java
git add backend/src/main/java/com/eventmanagement/backend/service/BookingService.java
git add backend/src/main/java/com/eventmanagement/backend/controller/BookingController.java
git add frontend/src/pages/BookingsPage.jsx
git add frontend/src/App.jsx

Write-Host "`n=== COMMITTING AS Shehani03 ===" -ForegroundColor Green
$env:GIT_AUTHOR_NAME = "Shehani03"
$env:GIT_AUTHOR_EMAIL = "Shehani03@users.noreply.github.com"
$env:GIT_AUTHOR_DATE = "2026-04-16T10:00:00+05:30"
$env:GIT_COMMITTER_NAME = "Shehani03"
$env:GIT_COMMITTER_EMAIL = "Shehani03@users.noreply.github.com"
$env:GIT_COMMITTER_DATE = "2026-04-16T10:00:00+05:30"

git commit -m "Add booking and ticketing module with capacity validation"

# Clean up env vars
Remove-Item Env:\GIT_AUTHOR_NAME -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_AUTHOR_EMAIL -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_NAME -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_EMAIL -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host "`n=== FINAL LOG (member3-venues) ===" -ForegroundColor Yellow
git log feature/member3-venues --oneline -6

Write-Host "`n=== FINAL LOG (member4-bookings) ===" -ForegroundColor Yellow
git log feature/member4-bookings --oneline -6

Write-Host "`n=== DONE! ===" -ForegroundColor Green
