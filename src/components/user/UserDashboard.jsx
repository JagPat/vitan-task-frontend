import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { fetchQuickStatsWithFallback } from '../../services/dashboardApi';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const UserDashboard = () => {
  const { authUser, logout } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    projects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        show({ title: 'Loading dashboard…', type: 'info', duration: 1200 });
        const s = await fetchQuickStatsWithFallback();
        setStats({
          totalTasks: s.totalTasks,
          completedTasks: s.completedTasks,
          pendingTasks: s.pendingTasks,
          projects: s.projects,
        });
        show({ title: 'Dashboard updated', description: `Source: ${s.source}`, type: 'success', duration: 1800 });
      } catch (err) {
        setError(err.message || 'Failed to load stats');
        show({ title: 'Failed to load stats', description: err.message, type: 'error', duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [show]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the auth hook
      show({ title: 'Logged out', type: 'success', duration: 1500 });
    } catch (error) {
      console.error('Logout error:', error);
      show({ title: 'Logout failed', description: error.message, type: 'error' });
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Loading user dashboard...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                User Access
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {authUser.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{authUser.email}</div>
                <div className="text-gray-500 capitalize">{authUser.role || 'user'}</div>
              </div>
              </div>
              
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading / Error States */}
        {loading && (
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Fetching latest stats…</span>
              </div>
            </CardContent>
          </Card>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            <div className="font-medium">We couldn't load your stats.</div>
            <div className="text-sm">{error}</div>
          </div>
        )}
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {authUser.email}!
            </h2>
            <p className="text-gray-600">
              Here's an overview of your tasks and projects.
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.projects}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State */}
        {!loading && !error && stats.totalTasks === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="font-medium text-blue-900">No tasks yet</div>
            <div className="text-sm text-blue-800">Create your first task to get started.</div>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={() => navigate('/tasks/new')} variant="outline" className="justify-start h-auto py-4 px-4 text-left">
                <div className="font-medium text-gray-900">Create New Task</div>
                <div className="text-sm text-gray-500">Add a new task to your list</div>
              </Button>
              
              <Button onClick={() => navigate('/projects')} variant="outline" className="justify-start h-auto py-4 px-4 text-left">
                <div className="font-medium text-gray-900">View Projects</div>
                <div className="text-sm text-gray-500">Browse your active projects</div>
              </Button>
              
              <Button onClick={() => navigate('/profile')} variant="outline" className="justify-start h-auto py-4 px-4 text-left">
                <div className="font-medium text-gray-900">Update Profile</div>
                <div className="text-sm text-gray-500">Manage your account settings</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;
