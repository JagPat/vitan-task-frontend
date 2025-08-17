import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Lazy load components
const LoginView = lazy(() => import('./modules/auth/views/LoginView').then(module => ({ default: module.LoginView })));
const TasksView = lazy(() => import('./modules/tasks/views/TasksView').then(module => ({ default: module.TasksView })));
const WhatsAppView = lazy(() => import('./modules/whatsapp/views/WhatsAppView').then(module => ({ default: module.WhatsAppView })));
const SystemView = lazy(() => import('./modules/system/views/SystemView').then(module => ({ default: module.SystemView })));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginView />
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksView />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/whatsapp"
          element={
            <ProtectedRoute>
              <WhatsAppView />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/system"
          element={
            <ProtectedRoute>
              <SystemView />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/tasks" : "/login"} replace />
          }
        />
        
        {/* Catch all */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/tasks" : "/login"} replace />
          }
        />
      </Routes>
    </Suspense>
  );
};
