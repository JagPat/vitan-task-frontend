import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../../../stores/authStore';

export const LoginView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/tasks';
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to WhatsTask
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your tasks and WhatsApp communications
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
};
