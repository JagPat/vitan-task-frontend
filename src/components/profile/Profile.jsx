import { useEffect, useState } from 'react';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-sm text-muted-foreground">Loading profile…</div>}
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Input value={user?.role || 'user'} disabled className="capitalize" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label>Preferred Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button disabled={loading}>{loading ? 'Saving…' : 'Save Profile'}</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;
