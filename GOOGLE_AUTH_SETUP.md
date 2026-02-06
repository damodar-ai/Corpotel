# Google Authentication Setup Guide

## Overview
This application now supports Google OAuth authentication. Users can log in using their Google accounts, and the session persists until they explicitly log out.

## How It Works

### Authentication Flow
1. **User clicks "Login with Google"** - Frontend fetches the Google authorization URL from backend
2. **User is redirected to Google** - User logs into their Google account and grants permissions
3. **Google redirects back** - Browser returns to `/login?code=AUTH_CODE&state=google-auth`
4. **Backend exchanges code for token** - Backend exchanges the authorization code for an ID token
5. **Session created** - JWT token is generated and stored in localStorage
6. **User logged in** - Token persists in localStorage until logout

### Session Management
- **Session Storage**: JWT token is stored in `localStorage` with key `token`
- **Session Persistence**: Token persists across browser sessions until user logout
- **Session Cleanup**: On logout, token and user data are removed from localStorage
- **Token Validation**: Token is automatically added to all API requests via axios interceptors
- **Token Expiration**: If token expires (401 response), user is redirected to login

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (development)
     - `http://localhost:3000/login` (development)
     - Your production URL (when deploying)
   - Copy the **Client ID** and **Client Secret**

### Step 2: Configure Backend Environment

1. Copy the `.env.example` file to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Google credentials:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_from_step_1
   GOOGLE_CLIENT_SECRET=your_client_secret_from_step_1
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

3. Other configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_random_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_db_password
   DB_NAME=corp_hotel_booking
   ```

### Step 3: Configure Frontend Environment

1. Create `.env` file in the `frontend/` directory:
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
   ```

2. (Optional) Add Google Client ID if using client-side libraries:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_from_step_1
   ```

### Step 4: Update Database Schema (if needed)

The database schema includes an `isGoogleAuth` field in the users table to track Google authentication. When a new user authenticates via Google:
- A random hashed password is generated (user cannot log in with email/password)
- The `isGoogleAuth` flag is set to `true`
- User data is automatically populated from Google profile

### Step 5: Start the Application

```bash
# Install dependencies
npm install

# Run both backend and frontend
npm run dev

# Or run them separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## API Endpoints

### Get Google Auth URL
```
GET /api/auth/google/url

Response:
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### Google OAuth Callback
```
POST /api/auth/google/callback

Request:
{
  "code": "authorization_code_from_google"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "corporateClientId": null
  }
}
```

### Logout
```
POST /api/auth/logout

Response:
{
  "message": "Logged out successfully"
}
```

## Session Persistence Features

1. **Automatic Session Recovery**: When users return to the site, their session is automatically restored from localStorage
2. **Cross-Tab Synchronization**: Sessions are shared across all tabs of the browser
3. **Secure Token Storage**: JWT tokens are httpOnly-like (managed by frontend)
4. **Automatic Token Refresh**: Expired tokens trigger automatic redirect to login
5. **Logout Clears Everything**: Logout removes all session data from localStorage

## Using the Same Session Across API Calls

All API calls automatically include the JWT token via axios interceptors:

```typescript
// Backend automatically sends token in Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

This means:
- Every API request from the frontend includes the authentication token
- The same session (token) is used for all requests
- No need to re-authenticate for each API call
- Token remains valid until explicitly logged out

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the `GOOGLE_REDIRECT_URI` in `.env` exactly matches the authorized redirect URI in Google Cloud Console
- Don't include trailing slashes unless Google Console has them

### Token expires with 401 error
- The axios interceptor will automatically redirect to `/login` on 401
- User can log in again

### User not created after Google login
- Check backend logs for database errors
- Ensure MySQL is running and database is initialized with schema
- Check that email from Google is valid

### "Failed to get user email from Google"
- This usually means the Google token is invalid
- Try clearing browser cache and re-authenticating
- Verify Google credentials in `.env`

## Security Considerations

1. **Never commit `.env` file** - It contains sensitive credentials
2. **JWT Secret**: Use a strong, random secret in production
3. **HTTPS Only**: In production, use `https://` for GOOGLE_REDIRECT_URI
4. **Token Expiration**: Consider implementing token expiration for better security
5. **Secure Storage**: In production, consider using httpOnly cookies instead of localStorage

## Example Usage in Components

```tsx
import { useAuth } from '../hooks/useAuth';

export const MyComponent = () => {
  const { user, token, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Additional Notes

- The application supports both traditional email/password login and Google OAuth
- Users can use either method based on preference
- If a user registers via email and later tries Google with the same email, they'll be logged in (existing user)
- Corporate features and roles are preserved when using Google authentication
