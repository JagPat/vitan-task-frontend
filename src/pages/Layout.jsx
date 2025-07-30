
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  Menu,
  X,
  Plus,
  MessageCircle,
  FolderOpen,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/api/entities";
import { Task } from "@/api/entities";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
    loadPendingTasks();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadPendingTasks = async () => {
    try {
      const tasks = await Task.filter({ status: "pending" });
      setPendingTasks(tasks.length);
    } catch (error) {
      console.error("Error loading pending tasks:", error);
    }
  };

  const Sidebar = ({ mobile = false }) => (
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
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              onClick={() => mobile && setMobileMenuOpen(false)}
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
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-slate-500">{user?.role || 'Member'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:block">
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xl">
          <Sidebar />
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
                <Sidebar mobile />
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
    </div>
  );
}
