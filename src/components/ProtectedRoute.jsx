import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const hasUser = typeof window !== 'undefined' ? sessionStorage.getItem('currentUser') : null;

  if (!token || !hasUser) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}



