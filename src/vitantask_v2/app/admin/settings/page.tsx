"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Server, Mail, Bell, Shield, Globe, Save, RefreshCw, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

// Mock system settings
const mockSettings = {
  general: {
    siteName: "VitanTask",
    siteDescription: "Professional task management platform",
    adminEmail: "admin@vitantask.com",
    timezone: "UTC-8",
    language: "English",
    maintenanceMode: false,
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@vitantask.com",
    smtpPassword: "••••••••••••",
    fromEmail: "noreply@vitantask.com",
    fromName: "VitanTask",
    emailEnabled: true,
  },
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    slackIntegration: false,
    webhookUrl: "https://hooks.slack.com/services/...",
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: "24",
    passwordMinLength: "8",
    maxLoginAttempts: "5",
    ipWhitelist: "",
  },
  api: {
    rateLimitEnabled: true,
    rateLimitRequests: "1000",
    rateLimitWindow: "60",
    apiKeyRequired: true,
  },
}

const systemStatus = {
  database: { status: "healthy", lastCheck: "2 minutes ago", responseTime: "12ms" },
  email: { status: "healthy", lastCheck: "5 minutes ago", responseTime: "234ms" },
  storage: { status: "warning", lastCheck: "1 minute ago", responseTime: "45ms" },
  api: { status: "healthy", lastCheck: "30 seconds ago", responseTime: "8ms" },
}

function getStatusIcon(status: string) {
  switch (status) {
    case "healthy":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(mockSettings)

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-balance">System Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Current status of system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.status)}
                      <span className="font-medium capitalize">{key}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Last check: {status.lastCheck}</div>
                      <div>Response: {status.responseTime}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  rows={2}
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.general.adminEmail}
                  onChange={(e) => updateSetting("general", "adminEmail", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting("general", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Temporarily disable site access</p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("general", "maintenanceMode", checked)}
                />
              </div>

              <Button onClick={() => handleSave("General")} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save General Settings"}
              </Button>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>SMTP configuration for outgoing emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Service</Label>
                  <p className="text-xs text-muted-foreground">Enable/disable email functionality</p>
                </div>
                <Switch
                  checked={settings.email.emailEnabled}
                  onCheckedChange={(checked) => updateSetting("email", "emailEnabled", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting("email", "smtpHost", e.target.value)}
                    disabled={!settings.email.emailEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting("email", "smtpPort", e.target.value)}
                    disabled={!settings.email.emailEnabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.email.smtpUsername}
                  onChange={(e) => updateSetting("email", "smtpUsername", e.target.value)}
                  disabled={!settings.email.emailEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => updateSetting("email", "smtpPassword", e.target.value)}
                  disabled={!settings.email.emailEnabled}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting("email", "fromEmail", e.target.value)}
                    disabled={!settings.email.emailEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting("email", "fromName", e.target.value)}
                    disabled={!settings.email.emailEnabled}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("Email")} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Email Settings"}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Authentication and security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting("security", "sessionTimeout", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting("security", "passwordMinLength", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting("security", "maxLoginAttempts", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist (optional)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1"
                  rows={2}
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSetting("security", "ipWhitelist", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of allowed IP addresses</p>
              </div>

              <Button onClick={() => handleSave("Security")} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Security Settings"}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Enable browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Integration</Label>
                  <p className="text-xs text-muted-foreground">Send notifications to Slack</p>
                </div>
                <Switch
                  checked={settings.notifications.slackIntegration}
                  onCheckedChange={(checked) => updateSetting("notifications", "slackIntegration", checked)}
                />
              </div>

              {settings.notifications.slackIntegration && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.notifications.webhookUrl}
                    onChange={(e) => updateSetting("notifications", "webhookUrl", e.target.value)}
                  />
                </div>
              )}

              <Button onClick={() => handleSave("Notifications")} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
