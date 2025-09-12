import React, { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useToast } from '../ui/ToastProvider';

const Profile = () => {
  const { show } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null); setLoading(true);
        // Try user profile endpoint; admin profile also exists
        const res = await apiGet('/api/modules/auth/me');
        setUser(res?.data || null);
      } catch (err) {
        setError(err.message);
        show({ title: 'Profile not available', description: err.message, type: 'warning' });
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {loading && <div>Loading profile…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="space-y-2">
          <div><span className="text-gray-500">Email:</span> {user?.email || '—'}</div>
          <div><span className="text-gray-500">Role:</span> {user?.role || 'user'}</div>
          <div className="mt-4 p-3 bg-gray-50 rounded border">Profile updates coming soon.</div>
        </div>
      )}
    </div>
  );
};

export default Profile;

