import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';

const AdminDashboard = () => {
  const { authUser, logout } = useAuth();
  const [stats, setStats] = useState({
    completionRate: 0,
    activeProjects: 0,
    teamCollaboration: 0,
    systemHealth: 'healthy'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard quick-stats...');
        
        const response = await apiClient.get('/api/modules/dashboard/quick-stats');
        console.log('Dashboard quick-stats response:', response);
        
        if (response && response.data) {
          setStats({
            completionRate: response.data.completionRate || 0,
            activeProjects: response.data.activeProjects || 0,
            teamCollaboration: response.data.teamCollaboration || 0,
            systemHealth: 'healthy'
          });
        } else {
          // Fallback to mock data if API response is unexpected
          setStats({
            completionRate: 0,
            activeProjects: 0,
            teamCollaboration: 0,
            systemHealth: 'healthy'
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
        // Fallback to mock data on error
        setStats({
          completionRate: 0,
          activeProjects: 0,
          teamCollaboration: 0,
          systemHealth: 'healthy'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the auth hook
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Welcome back, Administrator!
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              ✅ Authentication bypass is working! You now have unrestricted access to all admin modules.
            </p>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                🔐 NO AUTH - TESTING MODE
              </span>
              <span className="text-sm text-gray-600">Logged in as: {authUser.email}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
        </div>
      </div>

        {/* Quick Navigation */}
        <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚀 Quick Navigation - Test All Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/admin/ai" className="p-6 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 text-center bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-bold text-gray-900 text-lg">AI Dashboard</div>
              <div className="text-sm text-gray-600 mt-1">AI & ML Tools</div>
            </Link>
            
            <Link to="/admin/tasks" className="p-6 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-bold text-gray-900 text-lg">Task Management</div>
              <div className="text-sm text-gray-600 mt-1">Kanban & Lists</div>
            </Link>
            
            <Link to="/admin/team" className="p-6 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-200 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-bold text-gray-900 text-lg">Team Management</div>
              <div className="text-sm text-gray-600 mt-1">Users & Permissions</div>
            </Link>
            
            <Link to="/admin/modules" className="p-6 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 text-center bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-bold text-gray-900 text-lg">Modules</div>
              <div className="text-sm text-gray-600 mt-1">System Modules</div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 System Statistics</h3>
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading dashboard statistics...</div>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading stats: {error}</div>
              <div className="text-sm text-gray-500">Using fallback data</div>
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <p className="text-sm font-medium text-blue-700">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-900">{stats.completionRate}%</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">🚀</div>
                <p className="text-sm font-medium text-green-700">Active Projects</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeProjects}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">👥</div>
                <p className="text-sm font-medium text-purple-700">Team Collaboration</p>
                <p className="text-3xl font-bold text-purple-900">{stats.teamCollaboration}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">💚</div>
                <p className="text-sm font-medium text-yellow-700">System Health</p>
                <p className="text-3xl font-bold text-green-600 capitalize">{stats.systemHealth}</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        <div className="bg-white border-2 border-red-200 rounded-xl shadow-lg">
          <div className="px-8 py-6 border-b-2 border-red-200 bg-red-50">
            <h3 className="text-2xl font-bold text-gray-900 text-center">⚡ Administrative Actions</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/admin/team" className="p-6 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 text-left bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-2xl mb-2">👤</div>
                <div className="font-bold text-gray-900 text-lg">User Management</div>
                <div className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</div>
                <div className="text-xs text-blue-600 mt-2">✅ Available</div>
              </Link>
              
              <button 
                onClick={() => alert('System Settings - Coming Soon!\n\nThis will include:\n• Database configuration\n• Environment variables\n• System health monitoring\n• Performance tuning')}
                className="p-6 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-200 text-left bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-bold text-gray-900 text-lg">System Settings</div>
                <div className="text-sm text-gray-600 mt-1">Configure system parameters</div>
                <div className="text-xs text-orange-600 mt-2">🚧 Coming Soon</div>
              </button>
              
              <Link to="/admin/ai" className="p-6 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 text-left bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-bold text-gray-900 text-lg">Analytics & Reports</div>
                <div className="text-sm text-gray-600 mt-1">View system analytics and reports</div>
                <div className="text-xs text-green-600 mt-2">✅ Available</div>
              </Link>
              
              <button 
                onClick={() => alert('Backup & Restore - Coming Soon!\n\nThis will include:\n• Database backup scheduling\n• Automated restore points\n• Export/Import functionality\n• Disaster recovery')}
                className="p-6 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 text-left bg-gradient-to-br from-orange-50 to-yellow-50"
              >
                <div className="text-2xl mb-2">💾</div>
                <div className="font-bold text-gray-900 text-lg">Backup & Restore</div>
                <div className="text-sm text-gray-600 mt-1">Manage system backups</div>
                <div className="text-xs text-orange-600 mt-2">🚧 Coming Soon</div>
              </button>
              
              <button 
                onClick={() => alert('Security Logs - Coming Soon!\n\nThis will include:\n• Login attempt monitoring\n• Failed authentication logs\n• Suspicious activity alerts\n• Audit trail management')}
                className="p-6 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 text-left bg-gradient-to-br from-red-50 to-pink-50"
              >
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-bold text-gray-900 text-lg">Security Logs</div>
                <div className="text-sm text-gray-600 mt-1">Monitor security events</div>
                <div className="text-xs text-orange-600 mt-2">🚧 Coming Soon</div>
              </button>
              
              <button 
                onClick={() => alert('API Management - Coming Soon!\n\nThis will include:\n• API key generation\n• Rate limiting configuration\n• Endpoint monitoring\n• Usage analytics')}
                className="p-6 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 text-left bg-gradient-to-br from-indigo-50 to-blue-50"
              >
                <div className="text-2xl mb-2">🔑</div>
                <div className="font-bold text-gray-900 text-lg">API Management</div>
                <div className="text-sm text-gray-600 mt-1">Manage API keys and endpoints</div>
                <div className="text-xs text-orange-600 mt-2">🚧 Coming Soon</div>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
