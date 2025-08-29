# Google OAuth Setup for Admin Access

This document explains how to set up Google OAuth for admin authentication in the WhatsTask platform.

## 🔐 Backend Configuration

### 1. Environment Variables

Add the following environment variables to your Railway backend:

```bash
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
JWT_SECRET=your_jwt_secret_here
```

### 2. Google OAuth Client ID

To get a Google OAuth Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-frontend-domain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://your-frontend-domain.com` (for production)
8. Copy the Client ID and add it to your environment variables

## 🎨 Frontend Configuration

### 1. Environment Variables

Create a `.env.local` file in your frontend directory:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
VITE_API_BASE_URL=https://vitan-task-backend-production.up.railway.app
```

### 2. Google OAuth Script

The Google OAuth script is automatically loaded by the `GoogleAuthService`. Make sure your domain is authorized in the Google Cloud Console.

## 🚀 Usage

### Backend Endpoints

- `POST /api/modules/auth/google` - Google OAuth login
- `GET /api/modules/auth/google/verify` - Verify admin token
- `GET /api/modules/auth/admin/profile` - Get admin profile (protected)
- `GET /api/modules/auth/admin/stats` - Get admin statistics (protected)
- `POST /api/modules/auth/admin/logout` - Admin logout (protected)

### Frontend Components

- `GoogleOAuthLogin` - Login component with Google OAuth button
- `AdminDashboard` - Protected admin dashboard
- `googleAuthService` - Service for managing OAuth flow

### Example Usage

```jsx
import GoogleOAuthLogin from './components/auth/GoogleOAuthLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import googleAuthService from './services/googleAuth';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    setIsAdminLoggedIn(googleAuthService.isAdminLoggedIn());
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAdminLoggedIn(true);
    console.log('Admin logged in:', userData);
  };

  const handleLoginError = (error) => {
    console.error('Login failed:', error);
  };

  if (isAdminLoggedIn) {
    return <AdminDashboard />;
  }

  return (
    <GoogleOAuthLogin
      onLoginSuccess={handleLoginSuccess}
      onLoginError={handleLoginError}
    />
  );
}
```

## 🔒 Security Features

### 1. Email Restriction

Only users with the email `jagrutpatel@gmail.com` can authenticate as admin.

### 2. JWT Token Validation

- Tokens are verified on every admin request
- Tokens expire after 24 hours
- Admin middleware protects all admin routes

### 3. Protected Routes

All admin routes require:
- Valid JWT token
- Admin role verification
- Token expiration check

## 🧪 Testing

### 1. Local Development

1. Set up environment variables
2. Start backend: `npm run dev`
3. Start frontend: `npm run dev`
4. Navigate to login page
5. Click "Sign in with Google"
6. Use `jagrutpatel@gmail.com` account

### 2. Production Testing

1. Deploy backend with environment variables
2. Deploy frontend with environment variables
3. Test OAuth flow on production domain
4. Verify admin dashboard access

## 🚨 Troubleshooting

### Common Issues

1. **"Google OAuth not initialized"**
   - Check if `VITE_GOOGLE_CLIENT_ID` is set
   - Verify Google Cloud Console configuration

2. **"Access denied" error**
   - Ensure you're using `jagrutpatel@gmail.com`
   - Check if backend environment variables are set

3. **"Invalid Google token" error**
   - Verify `GOOGLE_CLIENT_ID` in backend
   - Check if domain is authorized in Google Cloud Console

4. **CORS errors**
   - Ensure frontend domain is in authorized origins
   - Check backend CORS configuration

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Railway logs for backend errors
4. Verify Google Cloud Console configuration
5. Test with different Google accounts

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT.io](https://jwt.io/) - JWT token debugging
