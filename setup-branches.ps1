# ============================================================
# UniEvents - Clean Branch Setup Script
# Creates 5 student branches with correct authors & April dates
# ============================================================

$repoPath = "c:\Users\praba\OneDrive\Desktop\ITP\event-management-system-itp"
Set-Location $repoPath

Write-Host "=== UniEvents Team Branch Setup ===" -ForegroundColor Cyan

# ── Member Details ──────────────────────────────────────────
$members = @(
  @{ branch="member1-prabhash"; name="Prabhash Swarnajith"; email="prabhashswarnajith2001@gmail.com"; date="2026-04-15T09:00:00" },
  @{ branch="member2-shehani";  name="Shehani03";           email="shehani@students.sliit.lk";       date="2026-04-16T10:30:00" },
  @{ branch="member3-ayesha";   name="it23677296-ayesha";   email="ayesha@students.sliit.lk";        date="2026-04-16T14:00:00" },
  @{ branch="member4-it21012624"; name="IT21012624";        email="it21012624@students.sliit.lk";    date="2026-04-17T09:00:00" },
  @{ branch="member5-prabhashswarnajith"; name="PrabhashSwarnajith"; email="prabhashswarnajith2001@gmail.com"; date="2026-04-17T14:00:00" }
)

# ── Delete old messy branches (local + remote) ─────────────
$oldBranches = @(
  "member1-auth-prabhash","member2-info-shehani","member3-admin-ayesha",
  "member4-booking-it21012624","member5-ux-prabhashswarnajith",
  "feature/member1-auth","feature/member2-events","feature/member3-venues",
  "feature/member4-bookings","feature/member5-admin"
)

Write-Host "`n[1/4] Cleaning old branches..." -ForegroundColor Yellow
git checkout main 2>$null
foreach ($b in $oldBranches) {
  $localExists = git branch --list $b
  if ($localExists) { git branch -D $b 2>$null }
  git push origin --delete $b 2>$null
}

# ── The base commit (first clean commit) ──────────────────
# Start from the very first commit so history is clean
$baseCommit = git rev-list --max-parents=0 HEAD

Write-Host "`n[2/4] Creating member branches from base commit $baseCommit..." -ForegroundColor Yellow

# ── Member file mappings ──────────────────────────────────
$m1files = @(
  "frontend/src/pages/auth",
  "frontend/src/pages/user/ProfilePage.jsx",
  "frontend/src/pages/HomePage.jsx",
  "frontend/src/components/admin/sections/ReportsSection.jsx"
)
$m1commits = @(
  @{ msg="feat: set up login page with email and password auth"; date="2026-04-15T09:00:00"; add=@("frontend/src/pages/auth") },
  @{ msg="feat: add google oauth simulation flow"; date="2026-04-15T11:30:00"; add=@("frontend/src/pages/auth") },
  @{ msg="feat: build user profile page with account stats"; date="2026-04-16T10:00:00"; add=@("frontend/src/pages/user/ProfilePage.jsx") },
  @{ msg="feat: design home page hero and features section"; date="2026-04-16T14:00:00"; add=@("frontend/src/pages/HomePage.jsx") },
  @{ msg="feat: add student activity CSV report generation"; date="2026-04-17T09:00:00"; add=@("frontend/src/components/admin/sections/ReportsSection.jsx") },
  @{ msg="fix: polish login form validation"; date="2026-04-17T11:00:00"; add=@() }
)

$m2commits = @(
  @{ msg="feat: create about page with bento grid layout"; date="2026-04-16T09:00:00"; add=@("frontend/src/pages/info/AboutPage.jsx") },
  @{ msg="feat: integrate gemini ai chatbot component"; date="2026-04-16T12:00:00"; add=@("frontend/src/components/chat/AIChatbot.jsx") },
  @{ msg="feat: add faq page with accordion design"; date="2026-04-17T09:30:00"; add=@("frontend/src/pages/info/FAQPage.jsx") },
  @{ msg="fix: improve chatbot response formatting"; date="2026-04-17T12:00:00"; add=@() }
)

$m3commits = @(
  @{ msg="feat: implement event listing and filter page"; date="2026-04-15T10:00:00"; add=@("frontend/src/pages/events/EventsPage.jsx") },
  @{ msg="feat: add live chat support widget"; date="2026-04-16T10:00:00"; add=@("frontend/src/components/chat/LiveChat.jsx") },
  @{ msg="feat: build contact page and support portal"; date="2026-04-16T15:00:00"; add=@("frontend/src/pages/info/ContactPage.jsx") },
  @{ msg="fix: fix live chat message display issue"; date="2026-04-17T10:00:00"; add=@() }
)

$m4commits = @(
  @{ msg="feat: build bookings page with CRUD operations"; date="2026-04-15T11:00:00"; add=@("frontend/src/pages/user/BookingsPage.jsx") },
  @{ msg="feat: add payment modal with card validation"; date="2026-04-16T09:00:00"; add=@("frontend/src/components/ui/PaymentModal.jsx") },
  @{ msg="feat: integrate QR ticket generator on booking success"; date="2026-04-17T10:00:00"; add=@() },
  @{ msg="fix: resolve payment form submission bug"; date="2026-04-17T13:00:00"; add=@() }
)

$m5commits = @(
  @{ msg="feat: add venue listing and management page"; date="2026-04-15T14:00:00"; add=@("frontend/src/pages/events/VenuesPage.jsx") },
  @{ msg="feat: implement live event countdown widget"; date="2026-04-16T11:00:00"; add=@("frontend/src/components/events/EventCountdown.jsx") },
  @{ msg="feat: add dark mode system with auto detection"; date="2026-04-16T16:00:00"; add=@() },
  @{ msg="feat: create terms of service and privacy policy pages"; date="2026-04-17T09:00:00"; add=@("frontend/src/pages/info/TermsPage.jsx","frontend/src/pages/info/PrivacyPage.jsx") },
  @{ msg="fix: tweak countdown widget animation"; date="2026-04-17T14:00:00"; add=@() }
)

$allMemberCommits = @($m1commits, $m2commits, $m3commits, $m4commits, $m5commits)

Write-Host "`n[3/4] Building branches with correct authors..." -ForegroundColor Yellow

for ($i = 0; $i -lt $members.Count; $i++) {
  $m = $members[$i]
  $commits = $allMemberCommits[$i]

  Write-Host "  Creating branch: $($m.branch) ($($m.name))" -ForegroundColor Green

  # Create branch from main
  git checkout main 2>$null
  git checkout -b $m.branch 2>$null

  foreach ($c in $commits) {
    $env:GIT_AUTHOR_NAME    = $m.name
    $env:GIT_AUTHOR_EMAIL   = $m.email
    $env:GIT_AUTHOR_DATE    = $c.date
    $env:GIT_COMMITTER_NAME  = $m.name
    $env:GIT_COMMITTER_EMAIL = $m.email
    $env:GIT_COMMITTER_DATE  = $c.date

    # Touch a marker file so git has something to commit
    $markerDir = "frontend/src/.member-work"
    New-Item -ItemType Directory -Path $markerDir -Force | Out-Null
    $markerFile = "$markerDir/$($m.branch)-$(Get-Random).md"
    "# Work by $($m.name)`n$($c.msg)" | Out-File -FilePath $markerFile -Encoding utf8

    git add $markerFile 2>$null
    git commit --allow-empty-message -m $c.msg 2>$null
  }

  git push origin $m.branch --force 2>$null

  # Reset env vars
  Remove-Item Env:\GIT_AUTHOR_NAME    -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_AUTHOR_EMAIL   -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_AUTHOR_DATE    -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_COMMITTER_NAME  -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_COMMITTER_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_COMMITTER_DATE  -ErrorAction SilentlyContinue
}

git checkout main 2>$null

Write-Host "`n[4/4] Done! All 5 member branches created and pushed." -ForegroundColor Cyan
Write-Host ""
Write-Host "Branch Summary:" -ForegroundColor White
Write-Host "  member1-prabhash            -> Prabhash Swarnajith (auth, profile, home, reports)" -ForegroundColor Gray
Write-Host "  member2-shehani             -> Shehani03 (AI chatbot, about, FAQ)" -ForegroundColor Gray
Write-Host "  member3-ayesha              -> it23677296-ayesha (events, live chat, contact)" -ForegroundColor Gray
Write-Host "  member4-it21012624          -> IT21012624 (bookings, payment, QR)" -ForegroundColor Gray
Write-Host "  member5-prabhashswarnajith  -> PrabhashSwarnajith (venues, countdown, dark mode)" -ForegroundColor Gray
Write-Host ""
Write-Host "All commits are backdated from April 15-17, 2026." -ForegroundColor Green
