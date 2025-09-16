import React, { useEffect, useState } from 'react';
import googleAuthService from '../../services/googleAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

const AdminSettings = () => {
  const [status, setStatus] = useState(null);
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isSuperAdmin = (googleAuthService.getAdminUser()?.role === 'super_admin');

  useEffect(() => {
    const run = async () => {
      try {
        await Promise.all([loadStatus(), loadConfig()]);
      } catch (e) {
        setError('Failed to load system settings');
      }
    };
    run();
  }, []);

  async function loadStatus() {
    const res = await fetch(`${API_BASE}/api/modules/system/status`);
    if (!res.ok) throw new Error('status');
    const json = await res.json();
    setStatus(json?.data || json);
  }

  async function loadConfig() {
    const res = await fetch(`${API_BASE}/api/modules/system/config`);
    if (!res.ok) throw new Error('config');
    const json = await res.json();
    setConfig(json?.data || json);
  }

  async function saveConfig(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = googleAuthService.getAdminToken();
      const res = await fetch(`${API_BASE}/api/modules/system/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(config || {})
      });
      if (!res.ok) throw new Error('save');
      await loadConfig();
    } catch (e) {
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  async function restartSystem() {
    try {
      const token = googleAuthService.getAdminToken();
      const res = await fetch(`${API_BASE}/api/modules/system/restart`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('restart');
      await loadStatus();
    } catch (e) {
      setError('Failed to restart system');
    }
  }

  const onConfigChange = (key, value) => {
    setConfig(prev => ({ ...(prev || {}), [key]: value }));
  };

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{status ? JSON.stringify(status, null, 2) : 'Loading...'}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveConfig} className="space-y-3">
            {config ? (
              <div className="space-y-3">
                {Object.entries(config).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm text-gray-700 col-span-1">{key}</label>
                    <input
                      data-testid={`config-${key}`}
                      className="col-span-2 border rounded p-2"
                      value={String(val)}
                      onChange={e => onConfigChange(key, e.target.value)}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  {isSuperAdmin && (
                    <Button type="button" variant="destructive" onClick={restartSystem}>Restart System</Button>
                  )}
                </div>
              </div>
            ) : 'Loading...'}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;




