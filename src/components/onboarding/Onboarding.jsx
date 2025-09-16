import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const Onboarding = () => {
  const { authUser } = useAuth();
  const { show } = useToast();
  const [language, setLanguage] = useState('en');
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (!authUser?.email) return;
        setLoading(true);
        const res = await apiGet(`/api/modules/onboarding/preferences?email=${encodeURIComponent(authUser.email)}`);
        if (res?.data) {
          setLanguage(res.data.preferred_language || 'en');
          setUseCase((res.data.answers && res.data.answers.use_case) || '');
        }
        setLoaded(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser?.email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await apiPost('/api/modules/onboarding/preferences', {
        email: authUser?.email,
        preferred_language: language,
        answers: { use_case: useCase }
      });
      show({ title: 'Saved', description: 'Preferences updated', type: 'success' });
    } catch (err) {
      setError(err.message);
      show({ title: 'Save failed', description: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="hi">हिन्दी</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe your use-case</label>
          <textarea value={useCase} onChange={(e) => setUseCase(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g., Manage project tasks via WhatsApp, daily summaries, etc." />
        </div>
        <Button disabled={loading}>
          {loading ? 'Saving…' : 'Save Preferences'}
        </Button>
      </form>
      {!loaded && (
        <div className="mt-3 text-sm text-gray-500">Loading existing preferences…</div>
      )}
      </CardContent>
    </Card>
  );
};

export default Onboarding;

