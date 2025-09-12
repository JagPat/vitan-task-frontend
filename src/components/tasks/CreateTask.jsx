import React, { useState } from 'react';
import { apiPost } from '../../services/api';
import { useToast } from '../ui/ToastProvider';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input name="title" value={form.title} onChange={onChange} required className="w-full border rounded px-3 py-2" placeholder="Task title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="Details" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={onChange} className="w-full border rounded px-3 py-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project ID (optional)</label>
            <input name="project_id" value={form.project_id} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="e.g. 123" />
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create Task'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;

