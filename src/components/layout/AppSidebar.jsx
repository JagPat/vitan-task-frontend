import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LayoutDashboard, CheckSquare, FolderOpen, User, Settings, BarChart3, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useAuth from '@/hooks/useAuth';

const userNav = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, testId: 'nav-link-dashboard' },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare, testId: 'nav-link-tasks' },
  { title: 'Create Task', href: '/tasks/new', icon: CheckSquare, testId: 'nav-link-create-task' },
  { title: 'Projects', href: '/projects', icon: FolderOpen, testId: 'nav-link-projects' },
  { title: 'Profile', href: '/profile', icon: User, testId: 'nav-link-profile' },
  { title: 'Onboarding', href: '/onboarding', icon: User, testId: 'nav-link-onboarding' },
];

const adminNav = [
  { title: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, testId: 'nav-link-admin-dashboard' },
  { title: 'Admin Roles', href: '/admin/roles', icon: Users, testId: 'nav-link-admin-roles' },
  { title: 'Admin Settings', href: '/admin/settings', icon: Settings, testId: 'nav-link-admin-settings' },
  { title: 'Admin Analytics', href: '/admin/analytics', icon: BarChart3, testId: 'nav-link-admin-analytics' },
];

const AppSidebar = ({ isCollapsed, onToggle }) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const { isAdmin } = useAuth();

  const toggle = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle();
  };

  const NavSection = ({ title, items }) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-2 py-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        </div>
      )}
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={active ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${collapsed ? 'px-2' : ''} ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
            asChild
            data-testid={item.testId}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.title}</span>}
            </Link>
          </Button>
        );
      })}
    </div>
  );

  NavSection.propTypes = {
    title: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        icon: PropTypes.any,
        testId: PropTypes.string,
      })
    ),
  };

  return (
    <div className={`flex h-full flex-col border-r bg-sidebar transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckSquare className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-lg">VitanTask</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <NavSection title="Main" items={userNav} />
        <Separator className="my-4" />
        {isAdmin() && <NavSection title="Admin" items={adminNav} />}
      </div>
    </div>
  );
};

export default AppSidebar;

AppSidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggle: PropTypes.func,
};
