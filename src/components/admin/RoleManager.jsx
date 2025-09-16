import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '@/components/ui/label';

const RoleManager = () => {
  const { authUser } = useAuth();
  const { show } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState({});

  const canEdit = authUser?.role === 'super_admin';

  useEffect(() => {
    (async () => {
      try {
        setError(null); setLoading(true);
        const res = await apiGet('/api/modules/users');
        setUsers(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onAssign = async (email) => {
    const nextRole = pending[email];
    if (!nextRole) return;
    try {
      await apiPost('/api/modules/auth/admin/assign-role', { email, role: nextRole });
      show({ title: 'Role updated', description: `${email} → ${nextRole}`, type: 'success' });
      setUsers((prev) => prev.map(u => u.email === email ? { ...u, role: nextRole } : u));
    } catch (err) {
      show({ title: 'Failed to update role', description: err.message, type: 'error' });
    }
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Role Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">Current User: {authUser?.email} • Role: {authUser?.role}</div>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading users…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.email}>
                  <td className="px-4 py-2 whitespace-nowrap">{u.name || '—'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {canEdit ? (
                      <select
                        className="border rounded px-2 py-1"
                        defaultValue={u.role}
                        onChange={(e) => setPending((p) => ({ ...p, [u.email]: e.target.value }))}
                      >
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className="capitalize">{u.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {canEdit ? (
                      <Button onClick={() => onAssign(u.email)} disabled={!pending[u.email] || pending[u.email] === u.role}>Assign</Button>
                    ) : (
                      <span className="text-xs text-gray-400">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!canEdit && (
        <div className="mt-3 text-sm text-gray-500">Only super_admin can change roles.</div>
      )}
      </CardContent>
    </Card>
  );
};

export default RoleManager;

