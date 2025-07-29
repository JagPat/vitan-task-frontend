
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Users, 
  ClipboardList, 
  MessageCircle,
  BarChart3,
  Settings
} from "lucide-react";

const ActionButton = ({ icon: Icon, title, description, href, color }) => (
  <Link to={href} className="block">
    <Button
      variant="ghost"
      className={`w-full h-auto p-4 flex items-start gap-3 justify-start hover:bg-gradient-to-r ${color} hover:text-white transition-all duration-200 group`}
    >
      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white/20 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-70">{description}</p>
      </div>
    </Button>
  </Link>
);

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      title: "Create Task",
      description: "Add a new task to your team",
      href: createPageUrl("CreateTask"),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Manage Team",
      description: "View and manage team members",
      href: createPageUrl("Team"),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: ClipboardList,
      title: "Templates",
      description: "Create task templates",
      href: createPageUrl("Templates"),
      color: "from-green-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View performance insights",
      href: createPageUrl("Analytics"),
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
        
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">WhatsApp Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-slate-600">Connected & Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            All notifications are being sent successfully
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
