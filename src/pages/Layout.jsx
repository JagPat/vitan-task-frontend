
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Bell, 
  CheckSquare, 
  FolderOpen, 
  FolderOpen as FolderOpenIcon, 
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  User as UserIcon,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityLog, Project, Task, TaskTemplate, User } from "@/api/entities";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import LoginDialog from "@/components/LoginDialog";
import { whatsTaskClient } from "@/api/whatsTaskClient";
import { toast } from "sonner";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: createPageUrl("Projects"),
    icon: FolderOpen,
  },
  {
    title: "My Tasks",
    url: createPageUrl("MyTasks"),
    icon: CheckSquare,
  },
  {
    title: "Team",
    url: createPageUrl("Team"),
    icon: Users,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Templates",
    url: createPageUrl("Templates"),
    icon: Settings,
  },
  {
    title: "AI Admin",
    url: createPageUrl("AIAdminDashboard"),
    icon: Zap,
  },
  {
    title: "Deleted Tasks",
    url: createPageUrl("DeletedTasks"),
    icon: History,
  },
];

// Move Sidebar component outside of Layout to prevent recreation on every render
const Sidebar = ({ mobile = false, user, isAuthenticated, pendingTasks, onLogout, onLoginClick, onMobileMenuClose }) => (
  <div className={`flex flex-col h-full ${mobile ? 'px-4' : ''}`}>
    <div className="p-6 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">WhatsTask</h2>
          <p className="text-xs text-slate-500 font-medium">Smart Task Management</p>
        </div>
      </div>
    </div>
    
    <nav className="flex-1 p-4 space-y-2">
      {navigationItems.map((item) => {
        const isActive = window.location.pathname === item.url;
        return (
          <Link
            key={item.title}
            to={item.url}
            onClick={() => mobile && onMobileMenuClose()}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive 
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 ${
              isActive ? 'scale-110' : 'group-hover:scale-105'
            }`} />
            <span className="font-medium">{item.title}</span>
            {item.title === "My Tasks" && pendingTasks > 0 && (
              <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 text-xs">
                {pendingTasks}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>

    <div className="p-4 border-t border-slate-200">
      {isAuthenticated ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {typeof user?.full_name === 'string' && user.full_name.length > 0 ? user.full_name.charAt(0) : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">
                {typeof user?.full_name === 'string' ? user.full_name : 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {typeof user?.email === 'string' ? user.email : 'user@example.com'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-slate-500">
                  {typeof user?.role === 'string' ? user.role : 'Member'}
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 mb-3">Please login to continue</p>
            <Button 
              onClick={onLoginClick}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuthentication();
    loadPendingTasks();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const currentUser = await User.me();
        
        if (currentUser && typeof currentUser === 'object' && !Array.isArray(currentUser)) {
          // Store only primitive values, never the object itself
          const userPrimitives = {
            id: typeof currentUser.id === 'number' ? currentUser.id : null,
            email: typeof currentUser.email === 'string' ? currentUser.email : '',
            full_name: typeof currentUser.full_name === 'string' ? currentUser.full_name : '',
            role: typeof currentUser.role === 'string' ? currentUser.role : '',
            verified: typeof currentUser.verified === 'boolean' ? currentUser.verified : false,
            created_at: typeof currentUser.created_at === 'string' ? currentUser.created_at : null,
            updated_at: typeof currentUser.updated_at === 'string' ? currentUser.updated_at : null,
          };
          setUser(userPrimitives);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser && typeof currentUser === 'object' && !Array.isArray(currentUser)) {
        const userPrimitives = {
          id: typeof currentUser.id === 'number' ? currentUser.id : null,
          email: typeof currentUser.email === 'string' ? currentUser.email : '',
          full_name: typeof currentUser.full_name === 'string' ? currentUser.full_name : '',
          role: typeof currentUser.role === 'string' ? currentUser.role : '',
          verified: typeof currentUser.verified === 'boolean' ? currentUser.verified : false,
          created_at: typeof currentUser.created_at === 'string' ? currentUser.created_at : null,
          updated_at: typeof currentUser.updated_at === 'string' ? currentUser.updated_at : null,
        };
        setUser(userPrimitives);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const loadPendingTasks = async () => {
    try {
      const tasks = await Task.getAll();
      const pendingCount = tasks.filter(task => task.status === 'pending').length;
      setPendingTasks(pendingCount);
    } catch (error) {
      console.error('Failed to load pending tasks:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
      const userPrimitives = {
        id: typeof userData.id === 'number' ? userData.id : null,
        email: typeof userData.email === 'string' ? userData.email : '',
        full_name: typeof userData.full_name === 'string' ? userData.full_name : '',
        role: typeof userData.role === 'string' ? userData.role : '',
        verified: typeof userData.verified === 'boolean' ? userData.verified : false,
        created_at: typeof userData.created_at === 'string' ? userData.created_at : null,
        updated_at: typeof userData.updated_at === 'string' ? userData.updated_at : null,
      };
      setUser(userPrimitives);
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      toast({
        title: "Welcome back!",
        description: `Hello, ${userPrimitives.full_name || userPrimitives.email}!`,
      });
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:block">
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xl">
          <Sidebar 
            user={user}
            isAuthenticated={isAuthenticated}
            pendingTasks={pendingTasks}
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginDialog(true)}
            onMobileMenuClose={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar 
                  mobile 
                  user={user}
                  isAuthenticated={isAuthenticated}
                  pendingTasks={pendingTasks}
                  onLogout={handleLogout}
                  onLoginClick={() => setShowLoginDialog(true)}
                  onMobileMenuClose={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-800">WhatsTask</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingTasks > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {pendingTasks}
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Quick Action Button */}
      <Link to={createPageUrl("CreateTask")} className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </Link>

      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
