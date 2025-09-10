const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

export async function fetchQuickStatsWithFallback() {
  // Try quick-stats first
  try {
    const res = await fetch(`${BASE_URL}/api/modules/dashboard/quick-stats`);
    if (res.ok) {
      const data = await res.json();
      // Map quick stats into our simple structure if present
      return {
        totalTasks: data?.tasksTotal ?? 0,
        completedTasks: data?.tasksCompleted ?? 0,
        pendingTasks: data?.tasksPending ?? 0,
        projects: data?.activeProjects ?? 0,
        source: 'quick-stats',
      };
    }
  } catch (_) {}

  // Fallback to tasks list
  try {
    const res = await fetch(`${BASE_URL}/api/modules/tasks`);
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Failed to fetch tasks');
    const tasks = Array.isArray(json?.data) ? json.data : [];
    const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
    const pending = tasks.length - completed;
    return {
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      projects: 0,
      source: 'tasks-fallback',
    };
  } catch (err) {
    throw err;
  }
}


