import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
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
          <div className="space-y-1">
            <Label>Describe your use-case</Label>
            <Textarea
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g., Manage project tasks via WhatsApp, daily summaries, etc."
            />
          </div>
          <Button disabled={loading}>{loading ? 'Saving…' : 'Save Preferences'}</Button>
        </form>
        {!loaded && (
          <div className="mt-3 text-sm text-muted-foreground">Loading existing preferences…</div>
        )}
      </CardContent>
    </Card>
  );
};

export default Onboarding;
