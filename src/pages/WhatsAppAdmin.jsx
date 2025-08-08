import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { ActivityLog } from "@/api/entities";
import { whatsTaskClient } from "@/api/whatsTaskClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendWhatsappMessage } from "@/api/functions";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Send,
  Image,
  FileText,
  Phone,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function WhatsAppAdmin() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [bulkMessage, setBulkMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDays, setFilterDays] = useState(30);

  useEffect(() => {
    loadWhatsAppData();
  }, []);

  const loadWhatsAppData = async () => {
    setLoading(true);
    try {
      const [tasksData, usersData, activitiesData, userData] = await Promise.all([
        Task.list("-created_date", 100),
        User.list("-created_date"),
        ActivityLog.filter({ whatsapp_message_sent: true }, "-created_date", 50),
        User.me().catch(() => null)
      ]);
      
      setTasks(tasksData);
      setUsers(usersData);
      setActivities(activitiesData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading WhatsApp admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivity = async () => {
    if (!filterPhone) return;
    const res = await whatsTaskClient.request(`/api/analytics/user/${encodeURIComponent(filterPhone)}/activity?days=${filterDays}`);
    setActivities(res?.data || []);
  };

  const getWhatsAppStats = () => {
    const whatsappUsers = users.filter(u => u.phone_number);
    const externalTasks = tasks.filter(t => t.is_external_assignment);
    const whatsappActivities = activities.filter(a => a.whatsapp_message_sent);
    const todayActivities = activities.filter(a => 
      new Date(a.created_date).toDateString() === new Date().toDateString()
    );

    return {
      whatsappUsers: whatsappUsers.length,
      externalTasks: externalTasks.length,
      messagesThisMonth: whatsappActivities.length,
      todayActivities: todayActivities.length
    };
  };

  const handleSendBulkMessage = async () => {
    if (!bulkMessage.trim() || selectedUsers.length === 0) return;

    try {
      const promises = selectedUsers.map(async (userId) => {
        const user = users.find(u => u.id === userId);
        if (user?.phone_number) {
          return sendWhatsappMessage({
            to: user.phone_number,
            name: user.full_name,
            task_title: "Admin Message",
            due_date: null,
            priority: "medium",
            is_external: false,
            created_by_name: currentUser?.full_name,
            message: bulkMessage
          });
        }
      });

      await Promise.all(promises);
      setBulkMessage("");
      setSelectedUsers([]);
      alert("Bulk message sent successfully!");
    } catch (error) {
      console.error("Error sending bulk message:", error);
      alert("Failed to send bulk message.");
    }
  };

  const stats = getWhatsAppStats();

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            WhatsApp Admin Panel
          </h1>
          <p className="text-slate-600 mt-1">
            Manage WhatsApp integration and monitor activity
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">WhatsApp Users</p>
                <p className="text-3xl font-bold text-slate-800">{stats.whatsappUsers}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">External Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{stats.externalTasks}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Messages This Month</p>
                <p className="text-3xl font-bold text-slate-800">{stats.messagesThisMonth}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Activity</p>
                <p className="text-3xl font-bold text-slate-800">{stats.todayActivities}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tasks">External Tasks</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent WhatsApp Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent WhatsApp Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{activity.performed_by_name}</span>
                        {' '}
                        {activity.action.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.notes}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(activity.created_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* WhatsApp Commands Guide */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>WhatsApp Commands Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Basic Commands</p>
                    <p className="text-sm text-blue-700 mt-1">
                      DONE - Mark task complete<br/>
                      HELP - Show available commands<br/>
                      STATUS - Check active tasks
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">With Photos</p>
                    <p className="text-sm text-green-700 mt-1">
                      Send photo + "PROGRESS" - Progress update<br/>
                      Send photo + "ISSUE" - Report problem<br/>
                      Send photo + "DONE" - Completion proof
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">Admin Commands</p>
                    <p className="text-sm text-purple-700 mt-1">
                      CREATE "Task" FOR "Name" ON +phone<br/>
                      ISSUE [description] - Report issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>WhatsApp Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.filter(u => u.phone_number).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.full_name}</p>
                        <p className="text-sm text-slate-500">{user.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.whatsapp_verified ? "default" : "secondary"}>
                        {user.whatsapp_verified ? "Verified" : "Unverified"}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Activity */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User WhatsApp Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Label>Phone (WhatsApp)</Label>
                  <Input value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} placeholder="+1234567890" />
                </div>
                <div>
                  <Label>Days</Label>
                  <Select value={String(filterDays)} onValueChange={(v) => setFilterDays(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="90">90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={loadUserActivity}>Load Activity</Button>
                </div>
              </div>

              <div className="space-y-3">
                {activities.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`p-2 rounded-full ${a.whatsapp_message_sent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{a.action}</Badge>
                        {a.whatsapp_message_sent ? <Badge className="bg-green-100 text-green-700" variant="outline">sent</Badge> : <Badge className="bg-amber-100 text-amber-700" variant="outline">not-sent</Badge>}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{a.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>External WhatsApp Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.filter(t => t.is_external_assignment).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{task.title}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Assigned to: {task.assigned_to_name} ({task.assigned_to_phone})
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Created: {format(new Date(task.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        task.status === 'completed' ? 'default' : 
                        task.status === 'in_progress' ? 'secondary' : 
                        'outline'
                      }>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      {task.attachments && task.attachments.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          {task.attachments.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Send Bulk WhatsApp Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Recipients
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {users.filter(u => u.phone_number).map((user) => (
                      <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{user.full_name} ({user.phone_number})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Message
                  </label>
                  <textarea
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="w-full p-3 border rounded-lg h-24 resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSendBulkMessage}
                  disabled={!bulkMessage.trim() || selectedUsers.length === 0}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message to {selectedUsers.length} User(s)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}