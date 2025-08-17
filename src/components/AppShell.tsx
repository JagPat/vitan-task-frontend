import React from 'react';
import { useAuthStore } from '../modules/auth/store';
import { authApi } from '../modules/auth/api';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    logout();
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Name & Environment */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">WhatsTask</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}
              </span>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, {user?.name || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <a
                href="/tasks"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3">📋</span>
                Tasks
              </a>
              <a
                href="/whatsapp"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3">💬</span>
                WhatsApp
              </a>
              <a
                href="/system"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3">⚙️</span>
                System
              </a>
            </nav>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
