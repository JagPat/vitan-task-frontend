import React, { useState, useEffect } from 'react';
import googleAuthService from '../../services/googleAuth';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [qsError, setQsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      if (!googleAuthService.isAdminLoggedIn()) {
        setError('Not authenticated as admin');
        setIsLoading(false);
        return;
      }

      const user = googleAuthService.getAdminUser();
      setAdminUser(user);

      // Verify token with backend
      const isValid = await googleAuthService.verifyToken();
      if (!isValid) {
        setError('Admin token expired or invalid');
        setIsLoading(false);
        return;
      }

      // Fetch admin stats
      await Promise.allSettled([
        fetchAdminStats(),
        fetchQuickStats()
      ]);
      
    } catch (error) {
      setError('Failed to verify admin status');
      console.error('Admin status check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

  const fetchAdminStats = async () => {
    try {
      const token = googleAuthService.getAdminToken();
      const response = await fetch(`${API_BASE}/api/modules/auth/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      } else {
        console.warn('Failed to fetch admin stats');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const fetchQuickStats = async () => {
    try {
      setQsError(null);
      // Try dashboard quick-stats first
      const res = await fetch(`${API_BASE}/api/modules/dashboard/quick-stats`);
      if (res.ok) {
        const data = await res.json();
        // Expected keys: completionRate, activeProjects, teamCollaboration
        if (typeof data === 'object' && data) {
          setQuickStats({
            completionRate: Number(data.completionRate) || 0,
            activeProjects: Number(data.activeProjects) || 0,
            teamCollaboration: Number(data.teamCollaboration) || 0
          });
          return;
        }
      }
      // Fallback to deriving from tasks
      await deriveQuickStatsFromTasks();
    } catch (e) {
      console.warn('Quick-stats fetch failed, deriving from tasks:', e?.message || e);
      await deriveQuickStatsFromTasks();
    }
  };

  const deriveQuickStatsFromTasks = async () => {
    try {
      const token = googleAuthService.getAdminToken();
      const res = await fetch(`${API_BASE}/api/modules/tasks`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('tasks endpoint error');
      const json = await res.json();
      const tasks = Array.isArray(json?.data) ? json.data : [];
      const total = tasks.length;
      const completed = tasks.filter(t => String(t?.status).toLowerCase() === 'completed').length;
      const completionRate = total ? Math.round((completed / total) * 100) : 0;
      const activeProjects = Array.from(new Set(tasks.map(t => t?.project_id).filter(Boolean))).length;
      setQuickStats({
        completionRate,
        activeProjects,
        // Deriving teamCollaboration requires richer telemetry; default to 0 here.
        teamCollaboration: 0,
      });
    } catch (e) {
      setQsError('Quick stats unavailable');
      setQuickStats({ completionRate: 0, activeProjects: 0, teamCollaboration: 0 });
    }
  };

  const handleLogout = async () => {
    try {
      await googleAuthService.logout();
      setAdminUser(null);
      setStats(null);
      setError(null);
      // Redirect or trigger logout event
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Not authenticated</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Admin Access
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {adminUser.picture && (
                  <img
                    src={adminUser.picture}
                    alt={adminUser.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{adminUser.name}</div>
                  <div className="text-gray-500">{adminUser.email}</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats (Dashboard) */}
        {quickStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{quickStats.completionRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-xl">🚀</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{quickStats.activeProjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Team Collaboration</p>
                  <p className="text-2xl font-semibold text-gray-900">{quickStats.teamCollaboration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">System Health</p>
                  <p className="text-2xl font-semibold text-green-600">{stats.systemHealth}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="font-medium text-gray-900">User Management</div>
                <div className="text-sm text-gray-500">Manage users and permissions</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="font-medium text-gray-900">System Settings</div>
                <div className="text-sm text-gray-500">Configure system parameters</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-sm text-gray-500">View system logs and analytics</div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
