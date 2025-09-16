import React, { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const ProjectsList = () => {
  const { show } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null); setLoading(true);
        const res = await apiGet('/api/modules/projects');
        setProjects(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err.message);
        show({ title: 'Failed to load projects', description: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading projects…</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && projects.length === 0 && (
            <div className="text-gray-600">No projects found.</div>
          )}
          <ul className="divide-y">
            {projects.map((p) => (
              <li key={p.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.description}</div>
                    <div className="text-xs text-gray-500 mt-1">Status: {p.status} • Progress: {p.progress}%</div>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">{p.priority}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsList;

