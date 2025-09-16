const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

async function fetchTasksCounts() {
  const res = await fetch(`${BASE_URL}/api/modules/tasks`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to fetch tasks');
  const tasks = Array.isArray(json?.data) ? json.data : [];
  const completed = tasks.filter(t => (t?.status || '').toLowerCase() === 'completed').length;
  const pending = tasks.length - completed;
  // Attempt to derive project count from project_id
  const projects = Array.from(new Set(tasks.map(t => t?.project_id).filter(Boolean))).length;
  return {
    totalTasks: tasks.length,
    completedTasks: completed,
    pendingTasks: pending,
    projects,
  };
}

export async function fetchQuickStatsWithFallback() {
  // Try dashboard quick-stats first to get projects/activity signals
  let quick = null;
  try {
    const res = await fetch(`${BASE_URL}/api/modules/dashboard/quick-stats`);
    if (res.ok) {
      const data = await res.json();
      quick = {
        completionRate: Number(data?.completionRate) || 0,
        activeProjects: Number(data?.activeProjects) || 0,
        teamCollaboration: Number(data?.teamCollaboration) || 0,
      };
    }
  } catch { /* ignore and fallback */ }

  // Always try to compute task counts to populate the user cards
  try {
    const counts = await fetchTasksCounts();
    return {
      totalTasks: counts.totalTasks,
      completedTasks: counts.completedTasks,
      pendingTasks: counts.pendingTasks,
      // Prefer quick-stats projects if available; otherwise derived projects
      projects: quick ? quick.activeProjects : counts.projects,
      source: quick ? 'quick-stats+tasks' : 'tasks-only',
    };
  } catch (err) {
    // As a last resort, return zeros with a clear error
    throw err;
  }
}



