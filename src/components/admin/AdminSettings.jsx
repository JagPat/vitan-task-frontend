import React, { useEffect, useState } from 'react';
import googleAuthService from '../../services/googleAuth';

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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">System Settings</h2>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-2">System Status</h3>
        <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{status ? JSON.stringify(status, null, 2) : 'Loading...'}</pre>
      </div>

      <form onSubmit={saveConfig} className="bg-white rounded shadow p-4">
        <h3 className="font-medium text-gray-800 mb-2">Configuration</h3>
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
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              {isSuperAdmin && (
                <button type="button" onClick={restartSystem} className="px-4 py-2 bg-red-600 text-white rounded">Restart System</button>
              )}
            </div>
          </div>
        ) : 'Loading...'}
      </form>
    </div>
  );
};

export default AdminSettings;




