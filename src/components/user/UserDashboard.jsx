import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/ToastProvider';
import { fetchQuickStatsWithFallback } from '../../services/dashboardApi';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const defaultStats = { totalTasks: 0, completedTasks: 0, pendingTasks: 0, projects: 0 };

const UserDashboard = () => {
  const { authUser, logout } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        show({ title: 'Loading dashboard…', type: 'info', duration: 1200 });
        const result = await fetchQuickStatsWithFallback();
        setStats({
          totalTasks: result.totalTasks,
          completedTasks: result.completedTasks,
          pendingTasks: result.pendingTasks,
          projects: result.projects,
        });
        show({ title: 'Dashboard updated', description: `Source: ${result.source}`, type: 'success', duration: 1800 });
      } catch (err) {
        setError(err.message || 'Failed to load stats');
        show({ title: 'Failed to load stats', description: err.message, type: 'error', duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [show]);

  const initials = useMemo(() => {
    if (!authUser?.email) return 'VT';
    return authUser.email
      .split('@')[0]
      .split('.')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await logout();
      show({ title: 'Logged out', type: 'success', duration: 1500 });
    } catch (err) {
      console.error('Logout error:', err);
      show({ title: 'Logout failed', description: err.message, type: 'error' });
    }
  };

  if (!authUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading user dashboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Stay on top of your work with a quick snapshot of tasks and projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">User Access</Badge>
          <div className="flex items-center gap-3 rounded-full border px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={authUser?.picture || ''} alt={authUser?.email || 'User avatar'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{authUser?.email}</p>
              <p className="text-xs capitalize text-muted-foreground">{authUser?.role || 'member'}</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {loading && (
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
            <span className="text-sm text-muted-foreground">Fetching the latest stats…</span>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          We couldn&apos;t load your stats right now. {error}
        </div>
      )}

      <Card>
        <CardContent className="space-y-2 py-6">
          <h2 className="text-xl font-semibold text-foreground">Hello, {authUser.email}</h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your workload for this week.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              📋
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-semibold text-foreground">{stats.totalTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-600">
              ✅
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-foreground">{stats.completedTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-500">
              ⏳
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-foreground">{stats.pendingTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              📁
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projects</p>
              <p className="text-2xl font-semibold text-foreground">{stats.projects}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!loading && !error && stats.totalTasks === 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          No tasks yet — create your first task to get started.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Button
              onClick={() => navigate('/tasks/new')}
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
            >
              <div>
                <p className="font-medium text-foreground">Create New Task</p>
                <p className="text-sm text-muted-foreground">Add a new task to your list</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/projects')}
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
            >
              <div>
                <p className="font-medium text-foreground">View Projects</p>
                <p className="text-sm text-muted-foreground">Browse your active projects</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="h-auto justify-start gap-3 rounded-xl border-dashed px-4 py-5 text-left"
            >
              <div>
                <p className="font-medium text-foreground">Update Profile</p>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
