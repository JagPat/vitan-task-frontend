import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet, apiPost } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/ToastProvider';

const ProjectDetail = () => {
  const { id } = useParams();
  const { show } = useToast();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const p = await apiGet(`/api/modules/projects/${id}`);
      const m = await apiGet(`/api/modules/projects/${id}/users`);
      setProject(p?.data || null);
      setMembers(Array.isArray(m?.data) ? m.data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const addMember = async () => {
    try {
      if (!newEmail) return;
      await apiPost(`/api/modules/projects/${id}/users`, { email: newEmail, role: newRole });
      setNewEmail(''); setNewRole('member');
      await load();
      show({ title: 'Member added', type: 'success' });
    } catch (e) {
      show({ title: 'Add member failed', description: e.message, type: 'error' });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {project && (
          <div className="space-y-6">
            <div>
              <div className="text-xl font-semibold">{project.name}</div>
              <div className="text-gray-600">{project.description}</div>
            </div>
            <div>
              <div className="font-medium mb-2">Team Members</div>
              <ul className="list-disc ml-5 mb-4">
                {members.map(m => (
                  <li key={m.email}>{m.email} — {m.role}</li>
                ))}
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label className="mb-1 block">Email</Label>
                  <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" />
                </div>
                <div>
                  <Label className="mb-1 block">Role</Label>
                  <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="member|manager" />
                </div>
                <div>
                  <Button onClick={addMember}>Add Member</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDetail;
