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
import AppLayout from './components/layout/AppLayout';

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
    <span className="ml-3 text-lg">Loading...</span>
  </div>
);

const ProtectedAppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

function App() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated() ? (
                <Navigate to={isAdmin() ? '/admin/dashboard' : '/dashboard'} replace />
              ) : (
                <GoogleOAuthLogin />
              )}
          />

          <Route element={<ProtectedAppLayout />}>
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
              path="/tasks"
              element={
                <UserRoute>
                  <TaskList />
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

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <AdminRoute>
                  <RoleManager />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
          </Route>

          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to={isAdmin() ? '/admin/dashboard' : '/dashboard'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              isAuthenticated() ? (
                <Navigate to={isAdmin() ? '/admin/dashboard' : '/dashboard'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
