import { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const ProjectsList = () => {
  const { show } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
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
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Loading projects…</div>}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && projects.length === 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            No projects found.
          </div>
        )}
        <ul className="divide-y divide-border">
          {projects.map((project) => (
            <li key={project.id || project.name} className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.description || 'No description provided.'}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: {project.status || 'pending'} • Progress: {project.progress ?? 0}%
                  </p>
                </div>
                <Badge variant="outline" className="w-fit capitalize">
                  {project.priority || 'medium'}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
