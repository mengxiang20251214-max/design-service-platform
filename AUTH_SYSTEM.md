# User Authentication System

## Overview

This document describes the implemented user authentication system for the Design Service Platform.

## Features

✅ User Registration - Create new accounts with email and password
✅ User Login - Sign in with credentials
✅ JWT Token Management - Secure token-based authentication
✅ Session Management - Automatic token storage and verification
✅ Protected Routes - Dashboard and user-specific pages
✅ Password Hashing - bcryptjs for secure password storage
✅ Type-Safe Authentication - Full TypeScript support

## Technology Stack

- **JWT** - JSON Web Tokens for stateless authentication
- **bcryptjs** - Password hashing and verification
- **Next.js API Routes** - Backend endpoints
- **React Context** - Client-side state management
- **Cookies** - Secure token storage

## File Structure

```
lib/
├── auth.ts                  # Authentication utilities
└── auth-context.tsx         # React Context for auth state

app/
├── api/auth/
│   ├── register/route.ts    # Register endpoint
│   ├── login/route.ts       # Login endpoint
│   ├── verify/route.ts      # Verify token endpoint
│   └── logout/route.ts      # Logout endpoint
├── login/page.tsx           # Login page
├── register/page.tsx        # Registration page
└── dashboard/page.tsx       # Protected dashboard page

components/
├── protected-route.tsx      # HOC for protected routes
└── ui/input.tsx            # Input component for forms
```

## API Endpoints

### POST /api/auth/register
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/login
Authenticate user and get session token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

Token is automatically set in HTTP-only cookie.

### GET /api/auth/verify
Verify current session and get user info

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/logout
Clear user session

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Usage

### Using Authentication Context

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Protecting Routes

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

### Using the Protected Route HOC

```tsx
import { withProtectedRoute } from '@/components/protected-route';

function MyDashboard() {
  return <div>My Dashboard</div>;
}

export default withProtectedRoute(MyDashboard);
```

## Security Considerations

### Current Implementation
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies for token storage
- ✅ CORS-safe same-site cookies
- ✅ Token verification on protected routes
- ✅ Client-side automatic redirection for unauthorized access

### Future Enhancements

Consider implementing these for production:
1. **Database Integration** - Replace in-memory storage with a real database
2. **Refresh Tokens** - Implement token refresh mechanism
3. **Email Verification** - Verify user email before account activation
4. **Password Reset** - Implement forgot password functionality
5. **OAuth Integration** - Add social login options
6. **Rate Limiting** - Prevent brute force attacks
7. **Account Lockout** - Lock accounts after failed login attempts
8. **Two-Factor Authentication** - Additional security layer

## Environment Variables

Create a `.env.local` file in the project root:

```env
JWT_SECRET=your-very-secure-secret-key-here
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:** Always use a strong, unique JWT_SECRET in production!

## Testing

### Test Credentials

You can use these test credentials to try the authentication system:

- Email: `test@example.com`
- Password: `password123`

Or create a new account through the registration page.

### Manual Testing

1. **Registration**: Visit `/register` and create a new account
2. **Login**: Go to `/login` and sign in with credentials
3. **Dashboard**: Access protected `/dashboard` page
4. **Logout**: Click logout button to end session

## Error Handling

The authentication system provides clear error messages for:
- Invalid credentials
- Duplicate email registration
- Missing required fields
- Password validation errors
- Expired tokens
- Invalid tokens

## Code Examples

### Example: Login Form

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      // User is now authenticated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Troubleshooting

### Issue: "Token not found" error on page refresh
- **Solution**: Ensure the `/api/auth/verify` endpoint is working correctly
- Check browser cookies contain the `auth_token`

### Issue: "Invalid token" error
- **Solution**: Token may have expired (7 days)
- Clear browser cookies and login again

### Issue: Cannot access protected pages
- **Solution**: Ensure `AuthProvider` is wrapping the app in `providers.tsx`
- Check that authentication context is correctly imported

## Next Steps

1. Integrate with a real database (MongoDB, PostgreSQL, etc.)
2. Implement email verification for registration
3. Add password reset functionality
4. Set up refresh token mechanism
5. Implement OAuth/SSO providers
6. Add comprehensive logging and monitoring
