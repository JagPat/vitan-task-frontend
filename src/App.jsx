import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import { useAuth } from './hooks/useAuth';

// Auth Components
import GoogleOAuthLogin from './components/auth/GoogleOAuthLogin';

// Route Guards
import AdminRoute from './components/auth/AdminRoute';
import UserRoute from './components/auth/UserRoute';

// Dashboard Components
import AdminDashboard from './components/admin/AdminDashboard';
import RoleManager from './components/admin/RoleManager';
import AdminSettings from './components/admin/AdminSettings';
import AdminAnalytics from './components/admin/AdminAnalytics';
import UserDashboard from './components/user/UserDashboard';
import CreateTask from './components/tasks/CreateTask';
import TaskList from './components/tasks/TaskList';
import ProjectsList from './components/projects/ProjectsList';
import Profile from './components/profile/Profile';
import Onboarding from './components/onboarding/Onboarding';

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

          {/* Protected Admin Routes (nested) */}
          <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="roles" element={<RoleManager />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Protected User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            } 
          />
          <Route
            path="/tasks/new"
            element={
              <UserRoute>
                <CreateTask />
              </UserRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <UserRoute>
                <ProjectsList />
              </UserRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <UserRoute>
                <TaskList />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserRoute>
                <Profile />
              </UserRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <UserRoute>
                <Onboarding />
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
