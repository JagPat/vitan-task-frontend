import React, { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useToast } from '../ui/ToastProvider';

const TaskList = () => {
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
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

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="text-sm text-gray-500">{tasks.length} items</div>
      </div>
      {loading && <div>Loading tasks…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && tasks.length === 0 && (
        <div className="text-gray-600">No tasks yet. Create one from the dashboard.</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map(t => (
              <tr key={t.id || `${t.title}-${t.created_at}`}>
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2 capitalize">{t.status || 'pending'}</td>
                <td className="px-4 py-2 capitalize">{t.priority || 'medium'}</td>
                <td className="px-4 py-2">{t.project_id || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{t.created_at ? new Date(t.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;

