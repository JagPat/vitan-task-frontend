import { useState } from 'react';
import { apiPost } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateTask = () => {
  const { show } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', project_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        project_id: form.project_id || null,
      };
      const res = await apiPost('/api/modules/tasks', payload);
      show({ title: 'Task created', description: `ID: ${res?.data?.id || 'mock'}`, type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      show({ title: 'Create task failed', description: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={onChange} required placeholder="Task title" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={form.description} onChange={onChange} placeholder="Details" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="project_id">Project ID (optional)</Label>
              <Input id="project_id" name="project_id" value={form.project_id} onChange={onChange} placeholder="e.g. 123" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button disabled={loading}>{loading ? 'Creating…' : 'Create Task'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTask;
