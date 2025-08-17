import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const navigation = [
  { name: 'Tasks', href: '/tasks', icon: '📋' },
  { name: 'WhatsApp', href: '/whatsapp', icon: '💬' },
  { name: 'System', href: '/system', icon: '⚙️' },
];

// Get build info from environment or use defaults
const getBuildInfo = () => {
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  const buildSha = import.meta.env.VITE_BUILD_SHA || 'dev';
  const deployTime = import.meta.env.VITE_DEPLOY_TIME || new Date().toISOString();
  
  return { buildTime, buildSha, deployTime };
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const buildInfo = getBuildInfo();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Name */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">WhatsTask</h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {import.meta.env.VITE_ENV_NAME || 'development'}
              </span>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="py-6 flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Build: {buildInfo.buildSha.substring(0, 7)}</span>
                  <span>•</span>
                  <span>Deployed: {new Date(buildInfo.deployTime).toLocaleDateString()}</span>
                </div>
                <div className="text-xs">
                  {import.meta.env.VITE_APP_NAME || 'WhatsTask'} v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
