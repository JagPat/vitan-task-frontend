import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import layout components
import { AppShell } from './frontend/components/AppShell';

// Import all admin components for unrestricted access
import AdminDashboard from './components/admin/AdminDashboard';
import AIDashboard from './components/admin/AIDashboard';
import ExperimentsTab from './components/admin/ExperimentsTab';

// Import task management components
import KanbanBoardView from './components/tasks/KanbanBoardView';
import TaskListView from './components/tasks/TaskListView';
import TaskTemplateManager from './components/tasks/TaskTemplateManager';
import TaskHistory from './components/tasks/TaskHistory';

// Import team management components
import TeamMemberCard from './components/team/TeamMemberCard';
import TeamStats from './components/team/TeamStats';
import InviteUserDialog from './components/team/InviteUserDialog';
import EditUserDialog from './components/team/EditUserDialog';

// Import project and template components
import ModuleManager from './components/ModuleManager';
import ContactManager from './components/ContactManager';

// Import additional admin components
import UserDashboard from './components/user/UserDashboard';
import Onboarding from './components/Onboarding/Onboarding';
import AnalyticsHeader from './components/analytics/AnalyticsHeader';

// Main App Component - NO AUTHENTICATION REQUIRED
function App() {
  // AUTO-REDIRECT: Always redirect to admin dashboard on app load
  React.useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  return (
    <Router>
      <AppShell>
        {/* NO AUTH CHECKS - All routes are publicly accessible */}
        <Routes>
          {/* Auto-redirect root to admin dashboard */}
          <Route 
            path="/" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />

          {/* Admin Dashboard - Main landing page */}
          <Route 
            path="/admin/dashboard" 
            element={<AdminDashboard />} 
          />

          {/* AI Dashboard */}
          <Route 
            path="/admin/ai" 
            element={<AIDashboard />} 
          />

          {/* Experiments */}
          <Route 
            path="/admin/experiments" 
            element={<ExperimentsTab />} 
          />

          {/* Task Management Routes */}
          <Route 
            path="/admin/tasks" 
            element={<KanbanBoardView />} 
          />

          <Route 
            path="/admin/tasks/list" 
            element={<TaskListView />} 
          />

          <Route 
            path="/admin/tasks/templates" 
            element={<TaskTemplateManager />} 
          />

          <Route 
            path="/admin/tasks/history" 
            element={<TaskHistory />} 
          />

          {/* Team Management Routes */}
          <Route 
            path="/admin/team" 
            element={<TeamMemberCard />} 
          />

          <Route 
            path="/admin/team/stats" 
            element={<TeamStats />} 
          />

          <Route 
            path="/admin/team/invite" 
            element={<InviteUserDialog />} 
          />

          <Route 
            path="/admin/team/edit" 
            element={<EditUserDialog />} 
          />

          {/* Module Management */}
          <Route 
            path="/admin/modules" 
            element={<ModuleManager />} 
          />

          {/* Contact Management */}
          <Route 
            path="/admin/contacts" 
            element={<ContactManager />} 
          />

          {/* Additional Admin Routes */}
          <Route 
            path="/admin/templates" 
            element={<TaskTemplateManager />} 
          />

          <Route 
            path="/admin/projects" 
            element={<div className="p-8"><h1 className="text-2xl font-bold">Projects Management</h1><p className="text-gray-600">Coming Soon - Project management features</p></div>} 
          />

          <Route 
            path="/admin/onboarding" 
            element={<Onboarding />} 
          />

          <Route 
            path="/admin/users" 
            element={<UserDashboard />} 
          />

          <Route 
            path="/admin/system" 
            element={<div className="p-8"><h1 className="text-2xl font-bold">System Settings</h1><p className="text-gray-600">Coming Soon - System configuration</p></div>} 
          />

          <Route 
            path="/admin/analytics" 
            element={<AnalyticsHeader />} 
          />

          {/* Additional Routes */}
          <Route 
            path="/admin/my-tasks" 
            element={<div className="p-8"><h1 className="text-2xl font-bold">My Tasks</h1><p className="text-gray-600">Personal task management</p></div>} 
          />

          <Route 
            path="/admin/deleted-tasks" 
            element={<div className="p-8"><h1 className="text-2xl font-bold">Deleted Tasks</h1><p className="text-gray-600">Manage deleted tasks</p></div>} 
          />

          {/* Catch all - Redirect to Admin Dashboard */}
          <Route 
            path="*" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
