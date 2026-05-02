# UniEvents API Keys Setup Guide

This guide provides step-by-step instructions to configure Google OAuth and Google Gemini API for the UniEvents application.

## Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [Google Gemini API Setup](#google-gemini-api-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing](#testing)

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "NEW PROJECT"
5. Enter project name: `UniEvents` (or your preference)
6. Click "CREATE"

### Step 2: Enable OAuth 2.0

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select "External" as User Type
3. Click "CREATE"
4. Fill in the following:
   - **App name**: `UniEvents`
   - **User support email**: `support@unievents.lk` (or your email)
   - **Developer contact**: Your email address
5. Click "SAVE AND CONTINUE"
6. Skip "Scopes" for now, click "SAVE AND CONTINUE"
7. Click "SAVE AND CONTINUE" again on the Summary page

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "CREATE CREDENTIALS" → **OAuth client ID**
3. Select **Web application**
4. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173`
   - `http://localhost:5175`
   - `http://localhost:3000`
   - `https://yourdomain.com` (production domain)
5. Under "Authorized redirect URIs", add:
   - `http://localhost:5173/auth`
   - `http://localhost:5175/auth`
   - `http://localhost:3000/auth`
   - `https://yourdomain.com/auth` (production)
6. Click "CREATE"
7. **Copy your Client ID** - you'll need this!

### Example Client ID Format
```
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

---

## Google Gemini API Setup

### Step 1: Enable Gemini API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Generative Language API"
3. Click on it and click "ENABLE"

### Step 2: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click "CREATE CREDENTIALS" → **API Key**
3. Copy the API Key that appears
4. **(Important)** Go to the key's restrictions:
   - Click on the key name
   - Under "API restrictions", select "Restrict key"
   - Add **"Generative Language API"**
   - Save the changes

### Example API Key Format
```
AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
```

---

## Environment Configuration

### Frontend Configuration

#### 1. Update SmartHelp Component

In `frontend/src/components/chat/SmartHelp.jsx`, replace:

```javascript
// BEFORE
const HELP_API_KEY = "AIzaSyDemo_Replace_With_Your_Key";

// AFTER
const HELP_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
```

Example:
```javascript
const HELP_API_KEY = "AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX";
```

#### 2. Update AuthPage Component

In `frontend/src/pages/auth/AuthPage.jsx`, the Google OAuth is already configured using a demo account selector. For production OAuth:

```javascript
// Current demo implementation uses Google-like UI with demo accounts
// For real Google OAuth, integrate Google Sign-In SDK:

<script src="https://accounts.google.com/gsi/client" async defer></script>

// Then initialize:
google.accounts.id.initialize({
  client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
});
```

### Backend Configuration (Currently Not Required)

The backend uses in-memory H2 database with demo users. For production with Google OAuth:

1. Add Spring Security OAuth2 dependency:
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

2. Configure in `application.properties`:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```

---

## Testing

### Test Google Gemini API

1. Open the application at `http://localhost:5175`
2. Click the **Help Desk** button (purple/indigo at bottom right)
3. Ask: "How do I book an event?"
4. If it responds with helpful text, the Gemini API is configured correctly

### Test Google OAuth

1. Go to `/auth` page
2. Click "Continue with Google"
3. You should see the Google account selector (demo or real)
4. After selecting/signing in, you'll be logged in

---

## API Rate Limits

### Gemini API
- **Free Tier**: 60 requests per minute
- **For production**, consider upgrading to a paid plan

### Google OAuth
- **Unlimited** (with usage quotas)

---

## Security Best Practices

### Do NOT commit API keys to Git!

1. Create a `.env.local` file in the frontend root:
```bash
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

2. Update `.gitignore`:
```
.env.local
.env
```

3. Update your build/config to read from env:
```javascript
const HELP_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## Troubleshooting

### "Invalid API key" Error
- Verify the key is correct and enabled
- Check Generative Language API is enabled
- Ensure the key is restricted to only that API
- API keys can take 5-10 minutes to activate

### "CORS error" in Browser Console
- Add your domain to OAuth authorized origins
- Ensure API requests use HTTPS in production

### "No valid credentials" Error
- Make sure OAuth consent screen is configured
- Refresh browser cache
- Create new credentials if needed

---

## Quick Reference

| Service | Setup Time | Required | Type |
|---------|-----------|----------|------|
| **Google Gemini API** | 5 minutes | Yes | API Key |
| **Google OAuth** | 10 minutes | Yes (demo only) | OAuth Credentials |
| **Backend OAuth** | 20 minutes | No (optional) | OAuth Config |

---

## Support

For detailed Google Cloud documentation:
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Gemini API Docs](https://ai.google.dev/)
- [Google Cloud Console](https://console.cloud.google.com/)

For UniEvents issues:
- Email: `support@unievents.lk`
- GitHub: `event-management-system-itp`
