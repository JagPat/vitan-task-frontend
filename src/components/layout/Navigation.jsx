import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const { authUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated()) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                WhatsTask
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              WhatsTask
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {/* User routes (visible to all authenticated users including admins) */}
              <Link
                to="/dashboard"
                data-testid="nav-link-dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                data-testid="nav-link-tasks"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Tasks
              </Link>
              <Link
                to="/projects"
                data-testid="nav-link-projects"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/profile"
                data-testid="nav-link-profile"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/onboarding"
                data-testid="nav-link-onboarding"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Onboarding
              </Link>
              {/* Optional: Create Task quick link */}
              <Link
                to="/tasks/new"
                data-testid="nav-link-create-task"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Create Task
              </Link>

              {/* Admin-only additional routes */}
              {isAdmin() && (
                <>
                  <Link
                    to="/admin/dashboard"
                    data-testid="nav-link-admin-dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/roles"
                    data-testid="nav-link-admin-roles"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Roles
                  </Link>
                  <Link
                    to="/admin/settings"
                    data-testid="nav-link-admin-settings"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Settings
                  </Link>
                  <Link
                    to="/admin/analytics"
                    data-testid="nav-link-admin-analytics"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Analytics
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex items-center gap-3 focus:outline-none"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {authUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900 leading-tight">{authUser?.email}</div>
                <div className="text-xs text-gray-500 capitalize leading-tight">{authUser?.role}{isAdmin() ? ' (Admin)' : ''}</div>
              </div>
              <svg className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="truncate text-sm font-medium text-gray-900">{authUser?.email}</p>
                </div>
                <div className="py-1" role="none">
                  <Link
                    to="/profile"
                    data-testid="nav-dropdown-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-100" role="none">
                  <button
                    onClick={handleLogout}
                    data-testid="nav-dropdown-logout"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
