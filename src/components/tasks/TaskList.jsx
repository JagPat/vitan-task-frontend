import { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const TaskList = () => {
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiGet('/api/modules/tasks');
        const list = Array.isArray(res?.data) ? res.data : [];
        setTasks(list);
      } catch (err) {
        setError(err.message);
        show({ title: 'Failed to load tasks', description: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  const renderStatusBadge = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const variant = normalized === 'completed' ? 'secondary' : normalized === 'in-progress' ? 'outline' : 'muted';
    return <Badge variant={variant} className="capitalize">{normalized}</Badge>;
  };

  return (
    <Card className="mx-auto max-w-6xl">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <p className="text-sm text-muted-foreground">Stay aligned with everything assigned to you.</p>
        </div>
        <Badge variant="outline">{tasks.length} items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Loading tasks…</div>}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && tasks.length === 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            No tasks yet. Create one from the dashboard to get started.
          </div>
        )}
        {tasks.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Priority</th>
                  <th className="px-4 py-3 text-left font-medium">Project</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {tasks.map((task) => (
                  <tr key={task.id || `${task.title}-${task.created_at}`} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                    <td className="px-4 py-3">{renderStatusBadge(task.status)}</td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{task.priority || 'medium'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{task.project_id || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {task.created_at ? new Date(task.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
