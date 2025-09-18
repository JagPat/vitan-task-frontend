import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  User,
  Settings,
  BarChart3,
  Users,
  ClipboardPlus,
  GraduationCap,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

const userNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, testId: 'nav-link-dashboard' },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare, testId: 'nav-link-tasks' },
  { label: 'Projects', to: '/projects', icon: FolderOpen, testId: 'nav-link-projects' },
  { label: 'Profile', to: '/profile', icon: User, testId: 'nav-link-profile' },
  { label: 'Onboarding', to: '/onboarding', icon: GraduationCap, testId: 'nav-link-onboarding' },
  { label: 'Create Task', to: '/tasks/new', icon: ClipboardPlus, testId: 'nav-link-create-task' },
];

const adminNav = [
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, testId: 'nav-link-admin-dashboard' },
  { label: 'Admin Roles', to: '/admin/roles', icon: Users, testId: 'nav-link-admin-roles' },
  { label: 'Admin Settings', to: '/admin/settings', icon: Settings, testId: 'nav-link-admin-settings' },
  { label: 'Admin Analytics', to: '/admin/analytics', icon: BarChart3, testId: 'nav-link-admin-analytics' },
];

const SidebarSection = ({ collapsed, title, items }) => {
  const location = useLocation();

  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-2 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
        return (
          <NavLink key={item.to} to={item.to} data-testid={item.testId} className="block">
            {({ isActive: navIsActive }) => (
              <Button
                variant={navIsActive || isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 text-sm',
                  collapsed ? 'px-2' : 'px-3',
                  (navIsActive || isActive) && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

SidebarSection.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      testId: PropTypes.string,
    })
  ).isRequired,
};

const Navigation = ({ children }) => {
  const { authUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = useMemo(() => {
    if (!authUser?.email) return 'VT';
    return authUser.email
      .split('@')[0]
      .split('.')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }, [authUser]);

  const sidebarContent = (
    <div className={cn('flex h-full flex-col border-r bg-sidebar transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight">VitanTask</span>
              <span className="text-xs text-muted-foreground">Workflows</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((prev) => !prev)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-2">
          <SidebarSection collapsed={collapsed} title="Overview" items={userNav} />
          {isAdmin() && (
            <>
              <Separator className={cn('my-2', collapsed && 'mx-auto h-8 w-px')} />
              <SidebarSection collapsed={collapsed} title="Admin" items={adminNav} />
            </>
          )}
        </nav>
      </div>
      <div className="border-t px-3 py-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={authUser?.picture || ''} alt={authUser?.email || 'User avatar'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{authUser?.email}</p>
              <p className="text-xs capitalize text-muted-foreground">{authUser?.role || 'member'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {!isMobile && sidebarContent}
      {isMobile && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            className="fixed left-4 top-4 z-40 h-10 w-10 bg-background shadow-md lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
              <div className="relative h-full w-64 max-w-[75vw] bg-sidebar shadow-xl">
                {sidebarContent}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Badge variant="secondary">{isAdmin() ? 'Admin Access' : 'User Access'}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks, projects..."
                className="w-56 pl-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={authUser?.picture || ''} alt={authUser?.email || 'User avatar'} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{authUser?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{authUser?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{authUser?.role || 'member'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNav.slice(0, 4).map((item) => (
                  <DropdownMenuItem key={item.to} onSelect={() => navigate(item.to)} data-testid={`${item.testId}-menu`}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={handleLogout} data-testid="nav-dropdown-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

Navigation.propTypes = {
  children: PropTypes.node,
};

export default Navigation;
