import React, { useEffect, useState } from 'react';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

const Profile = () => {
  const { show } = useToast();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null); setLoading(true);
        const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken') || '';
        const res = await fetch(`${API_BASE}/api/modules/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load profile');
        setUser(json?.data || null);
        setName(json?.data?.name || '');
        setLanguage(json?.data?.preferred_language || 'en');
      } catch (err) {
        setError(err.message);
        show({ title: 'Profile not available', description: err.message, type: 'warning' });
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      setError(null); setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken') || '';
      const res = await fetch(`${API_BASE}/api/modules/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, preferred_language: language })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Profile update failed');
      show({ title: 'Profile updated', type: 'success' });
    } catch (err) {
      setError(err.message);
      show({ title: 'Update failed', description: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
      {loading && <div>Loading profile…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={user?.email || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input value={user?.role || 'user'} disabled className="w-full border rounded px-3 py-2 bg-gray-50 capitalize" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="hi">हिन्दी</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <Button disabled={loading}>
            {loading ? 'Saving…' : 'Save Profile'}
          </Button>
        </form>
      )}
      </CardContent>
    </Card>
  );
};

export default Profile;
