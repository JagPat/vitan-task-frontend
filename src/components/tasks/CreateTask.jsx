import React, { useState } from 'react';
import { apiPost } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label className="mb-1 block">Title</Label>
          <Input name="title" value={form.title} onChange={onChange} required placeholder="Task title" />
        </div>
        <div>
          <Label className="mb-1 block">Description</Label>
          <Textarea name="description" value={form.description} onChange={onChange} placeholder="Details" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Priority</Label>
            <select name="priority" value={form.priority} onChange={onChange} className="w-full border rounded px-3 py-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <Label className="mb-1 block">Project ID (optional)</Label>
            <Input name="project_id" value={form.project_id} onChange={onChange} placeholder="e.g. 123" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button disabled={loading}>
            {loading ? 'Creating…' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
      </CardContent>
    </Card>
  );
};

export default CreateTask;

