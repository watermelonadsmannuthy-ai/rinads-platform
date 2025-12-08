# RINADS BusinessOS - Authentication Platform

## Overview

Complete authentication system for RINADS BusinessOS, designed to match the MOOI login interface style with RINADS branding.

## Pages Created

### 1. Login Page (`/login`)

**Features:**
- Warm gradient background (amber/orange/red)
- RINADS branding with circular "R" logo
- Clean white card with rounded corners
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Sign up link
- Support chat button (bottom right)
- Form validation
- Loading states

**Design Elements:**
- Gradient background: `from-amber-900 via-orange-900 to-red-900`
- Circular logo: Red gradient with white "R"
- White card with rounded top corners
- Red accent buttons
- Subtle background pattern

### 2. Signup Page (`/signup`)

**Features:**
- Same design as login page
- Additional fields:
  - Full Name
  - Email
  - Company Name (optional)
  - Password
  - Confirm Password
- Terms of Service and Privacy Policy checkboxes
- Password validation (min 8 characters)
- Password match validation

### 3. Forgot Password Page (`/forgot-password`)

**Features:**
- Email input for password reset
- Success state with confirmation message
- Back to sign in link
- Same design consistency

## Authentication System

### Auth Utilities (`lib/auth.ts`)

**Functions:**
- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user email
- `logout()` - Clear auth and redirect to login
- `requireAuth()` - Protect routes (redirects if not authenticated)

**Storage:**
- Uses `localStorage` for client-side persistence
- Keys: `rinads-auth` and `rinads-user`
- Ready to swap for backend API calls

### Navigation Integration

**BusinessOSNav Updates:**
- Shows "Sign In" button when not authenticated
- Shows user email and "Logout" button when authenticated
- Works on both desktop and mobile
- Real-time auth state updates

## Design Specifications

### Color Scheme
- **Background:** Gradient from amber-900 → orange-900 → red-900
- **Card:** White (#ffffff)
- **Primary Button:** Red gradient (red-600 to red-700)
- **Text:** Gray-900 for form labels, white for branding
- **Accents:** Red-600 for links and focus states

### Typography
- **Brand Name:** Bold, 5xl-6xl, white
- **Subtitle:** lg-xl, white/90
- **Form Title:** 3xl, bold, gray-900
- **Labels:** sm, medium, gray-700

### Components
- **Logo Circle:** 24x24 (96px), red gradient, white "R"
- **Card:** max-w-md, rounded-t-3xl, rounded-b-2xl
- **Input Fields:** Gray-100 background, gray-300 border
- **Support Button:** Fixed bottom-right, red-600, circular

## User Flow

1. **New User:**
   - Visit `/signup`
   - Fill in registration form
   - Redirected to homepage (authenticated)

2. **Existing User:**
   - Visit `/login`
   - Enter email and password
   - Redirected to homepage (authenticated)

3. **Forgot Password:**
   - Click "Forgot password?" on login page
   - Enter email on `/forgot-password`
   - Receive confirmation message

4. **Logout:**
   - Click "Logout" in navigation
   - Redirected to login page
   - Auth state cleared

## Integration with Backend

To connect to a real backend API:

1. **Update `lib/auth.ts`:**
```typescript
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('rinads-auth', 'true');
    localStorage.setItem('rinads-token', data.token);
  }
  return data;
}
```

2. **Update login page:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = await login(email, password);
  if (result.success) {
    router.push('/');
  } else {
    setError(result.message);
  }
};
```

## Security Notes

**Current Implementation:**
- Client-side only (localStorage)
- No real authentication
- For development/demo purposes

**Production Recommendations:**
- Use NextAuth.js or similar
- Implement JWT tokens
- Add refresh token rotation
- Use httpOnly cookies
- Add CSRF protection
- Implement rate limiting
- Add 2FA support

## Files Structure

```
app/
  login/
    page.tsx          # Login page
  signup/
    page.tsx          # Signup page
  forgot-password/
    page.tsx          # Password reset page

lib/
  auth.ts             # Authentication utilities

components/
  businessos/
    BusinessOSNav.tsx # Updated with auth state
```

## Testing

1. **Login:**
   - Visit `/login`
   - Enter any email/password
   - Should redirect to homepage
   - Navigation should show user email

2. **Signup:**
   - Visit `/signup`
   - Fill form and submit
   - Should redirect to homepage

3. **Logout:**
   - Click logout in navigation
   - Should redirect to login
   - Auth state cleared

4. **Forgot Password:**
   - Click "Forgot password?" on login
   - Enter email and submit
   - Should show confirmation

## Customization

### Change Brand Colors

Edit gradient in page files:
```tsx
className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900"
```

### Change Logo

Replace the circular "R" with your logo:
```tsx
<div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center">
  <img src="/logo.png" alt="RINADS" />
</div>
```

### Add Social Login

Add buttons in login/signup forms:
```tsx
<button className="w-full bg-blue-600 text-white py-3 rounded-lg">
  Continue with Google
</button>
```

## Access URLs

- **Login:** http://localhost:3000/login
- **Signup:** http://localhost:3000/signup
- **Forgot Password:** http://localhost:3000/forgot-password

---

Built with Next.js 14, TypeScript, and Tailwind CSS.

