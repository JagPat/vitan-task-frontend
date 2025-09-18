import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleAuthService from '../../services/googleAuth';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = useCallback(async () => {
    try {
      const token = googleAuthService.getAdminToken();
      const response = await fetch(`${API_BASE}/api/modules/auth/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      } else {
        console.warn('Failed to fetch admin stats');
      }
    } catch (_error) {
      console.error('Error fetching admin stats:', _error);
    }
  }, []);

  const deriveQuickStatsFromTasks = useCallback(async () => {
    try {
      const token = googleAuthService.getAdminToken();
      const res = await fetch(`${API_BASE}/api/modules/tasks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('tasks endpoint error');
      const json = await res.json();
      const tasks = Array.isArray(json?.data) ? json.data : [];
      const total = tasks.length;
      const completed = tasks.filter((t) => String(t?.status).toLowerCase() === 'completed').length;
      const completionRate = total ? Math.round((completed / total) * 100) : 0;
      const activeProjects = Array.from(new Set(tasks.map((t) => t?.project_id).filter(Boolean))).length;
      setQuickStats({
        completionRate,
        activeProjects,
        teamCollaboration: 0,
      });
    } catch {
      setQuickStats({ completionRate: 0, activeProjects: 0, teamCollaboration: 0 });
    }
  }, []);

  const fetchQuickStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/modules/dashboard/quick-stats`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data === 'object' && data) {
          setQuickStats({
            completionRate: Number(data.completionRate) || 0,
            activeProjects: Number(data.activeProjects) || 0,
            teamCollaboration: Number(data.teamCollaboration) || 0,
          });
          return;
        }
      }
      await deriveQuickStatsFromTasks();
    } catch {
      console.warn('Quick-stats fetch failed, deriving from tasks');
      await deriveQuickStatsFromTasks();
    }
  }, [deriveQuickStatsFromTasks]);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (!googleAuthService.isAdminLoggedIn()) {
        setError('Not authenticated as admin');
        setIsLoading(false);
        return;
      }

      const user = googleAuthService.getAdminUser();
      setAdminUser(user);

      const isValid = await googleAuthService.verifyToken();
      if (!isValid) {
        setError('Admin token expired or invalid');
        setIsLoading(false);
        return;
      }

      await Promise.allSettled([
        fetchAdminStats(),
        fetchQuickStats(),
      ]);
    } catch (_error) {
      setError('Failed to verify admin status');
      console.error('Admin status check error:', _error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAdminStats, fetchQuickStats]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const handleLogout = async () => {
    try {
      await googleAuthService.logout();
      setAdminUser(null);
      setStats(null);
      setError(null);
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const initials = useMemo(() => {
    if (!adminUser?.email) return 'AD';
    return adminUser.email
      .split('@')[0]
      .split('.')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }, [adminUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <span className="text-lg text-muted-foreground">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-destructive text-lg font-medium">{error}</div>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground text-lg">Not authenticated</div>
          <Button onClick={() => window.location.reload()}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor workspace health and jump into the modules you manage most.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Admin Access</Badge>
          <div className="hidden items-center gap-3 rounded-full border px-3 py-2 md:flex">
            <Avatar className="h-9 w-9">
              <AvatarImage src={adminUser?.picture || ''} alt={adminUser?.name || 'Admin avatar'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {quickStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                📈
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-semibold text-foreground">{quickStats.completionRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                🚀
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-semibold text-foreground">{quickStats.activeProjects}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                👥
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Team Collaboration</p>
                <p className="text-2xl font-semibold text-foreground">{quickStats.teamCollaboration}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                👤
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                🗂️
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalTasks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                📁
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                ✅
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">System Health</p>
                <p className="text-2xl font-semibold text-green-600">{stats.systemHealth}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Admin Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Quick links to manage the workspace</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Button
              data-testid="admin-action-users"
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
              onClick={() => navigate('/admin/roles')}
            >
              <div>
                <p className="font-medium text-foreground">User Management</p>
                <p className="text-sm text-muted-foreground">Manage users and permissions</p>
              </div>
            </Button>
            <Button
              data-testid="admin-action-settings"
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
              onClick={() => navigate('/admin/settings')}
            >
              <div>
                <p className="font-medium text-foreground">System Settings</p>
                <p className="text-sm text-muted-foreground">Configure platform parameters</p>
              </div>
            </Button>
            <Button
              data-testid="admin-action-analytics"
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
              onClick={() => navigate('/admin/analytics')}
            >
              <div>
                <p className="font-medium text-foreground">Analytics & Logs</p>
                <p className="text-sm text-muted-foreground">View system insights and history</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
