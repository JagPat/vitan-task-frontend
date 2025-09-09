import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import { useAuth } from './hooks/useAuth';

// Auth Components
import GoogleOAuthLogin from './components/auth/GoogleOAuthLogin';

// Route Guards
import AdminRoute from './components/auth/AdminRoute';
import UserRoute from './components/auth/UserRoute';

// Dashboard Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';

// Layout Components
import Navigation from './components/layout/Navigation';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-lg">Loading...</span>
  </div>
);

// Main App Component
function App() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? (
                <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
              ) : (
                <GoogleOAuthLogin />
              )
            } 
          />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminRoute>
            } 
          />

          {/* Protected User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            } 
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? (
                <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch all - redirect to appropriate dashboard */}
          <Route 
            path="*" 
            element={
              isAuthenticated() ? (
                <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
