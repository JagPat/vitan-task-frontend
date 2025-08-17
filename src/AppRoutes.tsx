import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Lazy load components
const LoginView = lazy(() => import('./modules/auth/views/LoginView').then(module => ({ default: module.LoginView })));
const TasksView = lazy(() => import('./modules/tasks/views/TasksView').then(module => ({ default: module.TasksView })));
const WhatsAppView = lazy(() => import('./modules/whatsapp/views/WhatsAppView').then(module => ({ default: module.WhatsAppView })));
const SystemStatus = lazy(() => import('./pages/SystemStatus').then(module => ({ default: module.SystemStatus })));

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginView />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TasksView />
          </ProtectedRoute>
        } />
        <Route path="/whatsapp" element={
          <ProtectedRoute>
            <WhatsAppView />
          </ProtectedRoute>
        } />
        <Route path="/system" element={
          <ProtectedRoute>
            <SystemStatus />
          </ProtectedRoute>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </Suspense>
  );
};
