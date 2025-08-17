import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ToastContainer } from './components/Toast';
import { useToastStore } from './stores/toastStore';
import { useAuthStore } from './stores/authStore';
import { AppRoutes } from './AppRoutes';

function App() {
  const { toasts, removeToast } = useToastStore();
  const { setUser, setAuthenticated } = useAuthStore();

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, [setUser, setAuthenticated]);

  return (
    <Router>
      <div className="App">
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        
        {/* App Shell with Routes */}
        <AppShell>
          <AppRoutes />
        </AppShell>
      </div>
    </Router>
  );
}

export default App;
