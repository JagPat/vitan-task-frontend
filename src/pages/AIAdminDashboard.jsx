import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Activity, 
  AlertTriangle,
  BarChart3,
  CheckCircle,
  DollarSign, 
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Save,
  Users, 
  Zap,
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

export default function AIAdminDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [costLimits, setCostLimits] = useState({
    dailyLimit: 1000,
    monthlyBudget: 50,
    perUserDailyLimit: 100,
    emergencyThreshold: 100,
  });
  const [aiEnabled, setAiEnabled] = useState(true);
  const [usageStats, setUsageStats] = useState({
    totalRequests: 0,
    totalCost: 0,
    dailyRequests: 0,
    monthlyCost: 0,
    userCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    aiService: 'operational',
    costManagement: 'active',
    emergencyMode: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load API key status
      const keyResponse = await fetch('https://vitan-task-production.up.railway.app/admin/api-key-status', { credentials: 'include' });
      if (!keyResponse.ok) {
        throw new Error('Failed to load API key status');
      }
      const keyData = await keyResponse.json();
      setApiKey(keyData.hasKey ? '••••••••••••••••' : '');
      
      // Load cost limits
      const limitsResponse = await fetch('https://vitan-task-production.up.railway.app/admin/cost-limits', { credentials: 'include' });
      if (!limitsResponse.ok) {
        throw new Error('Failed to load cost limits');
      }
      const limitsData = await limitsResponse.json();
      setCostLimits(limitsData);
      
      // Load usage stats
      const statsResponse = await fetch('https://vitan-task-production.up.railway.app/admin/usage-stats', { credentials: 'include' });
      if (!statsResponse.ok) {
        throw new Error('Failed to load usage stats');
      }
      const statsData = await statsResponse.json();
      setUsageStats(statsData.global);
      
      // Load system status
      const statusResponse = await fetch('https://vitan-task-production.up.railway.app/admin/system-status', { credentials: 'include' });
      if (!statusResponse.ok) {
        throw new Error('Failed to load system status');
      }
      const statusData = await statusResponse.json();
      setSystemStatus(statusData);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateApiKey = async () => {
    if (!apiKey.trim() || apiKey === '••••••••••••••••') {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://vitan-task-production.up.railway.app/admin/update-api-key', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "API key updated successfully",
        });
        setApiKey('••••••••••••••••');
        setIsApiKeyVisible(false);
      } else {
        throw new Error('Failed to update API key');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCostLimits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://vitan-task-production.up.railway.app/admin/update-cost-limits', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(costLimits),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Cost limits updated successfully",
        });
      } else {
        throw new Error('Failed to update cost limits');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update cost limits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAiService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://vitan-task-production.up.railway.app/admin/toggle-ai-service', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !aiEnabled }),
      });

      if (response.ok) {
        setAiEnabled(!aiEnabled);
        toast({
          title: "Success",
          description: `AI service ${!aiEnabled ? 'enabled' : 'disabled'} successfully`,
        });
      } else {
        throw new Error('Failed to toggle AI service');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle AI service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const emergencyStop = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://vitan-task-production.up.railway.app/admin/emergency-stop', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast({
          title: "Emergency Stop Activated",
          description: "AI service has been temporarily disabled due to cost limits",
          variant: "destructive",
        });
        setSystemStatus(prev => ({ ...prev, emergencyMode: true }));
      } else {
        throw new Error('Failed to activate emergency stop');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to activate emergency stop",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDailyCounters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://vitan-task-production.up.railway.app/admin/reset-daily-counters', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Daily counters reset successfully",
        });
        loadAdminData(); // Reload data
      } else {
        throw new Error('Failed to reset daily counters');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to reset daily counters",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCostPercentage = () => {
    return Math.min((usageStats.totalCost / costLimits.monthlyBudget) * 100, 100);
  };

  const getDailyUsagePercentage = () => {
    return Math.min((usageStats.dailyRequests / costLimits.dailyLimit) * 100, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage OpenAI API keys, cost controls, and system settings</p>
        </div>
        <Button onClick={loadAdminData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Service Status</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.aiService)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemStatus.aiService}</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus.emergencyMode ? 'Emergency mode active' : 'Service operational'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Management</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemStatus.costManagement}</div>
            <p className="text-xs text-muted-foreground">
              Budget controls active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Using AI features
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            OpenAI API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex-1 flex items-center space-x-2">
              <Input
                id="api-key"
                type={isApiKeyVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
              >
                {isApiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={updateApiKey} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={aiEnabled}
              onCheckedChange={toggleAiService}
              disabled={isLoading}
            />
            <Label>Enable AI Service</Label>
            <Badge variant={aiEnabled ? "default" : "secondary"}>
              {aiEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cost Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Cost Management Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="daily-limit">Daily Request Limit</Label>
              <Input
                id="daily-limit"
                type="number"
                value={costLimits.dailyLimit}
                onChange={(e) => setCostLimits(prev => ({ ...prev, dailyLimit: parseInt(e.target.value, 10) }))}
              />
            </div>
            <div>
              <Label htmlFor="monthly-budget">Monthly Budget ($)</Label>
              <Input
                id="monthly-budget"
                type="number"
                value={costLimits.monthlyBudget}
                onChange={(e) => setCostLimits(prev => ({ ...prev, monthlyBudget: parseInt(e.target.value, 10) }))}
              />
            </div>
            <div>
              <Label htmlFor="per-user-limit">Per User Daily Limit</Label>
              <Input
                id="per-user-limit"
                type="number"
                value={costLimits.perUserDailyLimit}
                onChange={(e) => setCostLimits(prev => ({ ...prev, perUserDailyLimit: parseInt(e.target.value, 10) }))}
              />
            </div>
            <div>
              <Label htmlFor="emergency-threshold">Emergency Threshold ($)</Label>
              <Input
                id="emergency-threshold"
                type="number"
                value={costLimits.emergencyThreshold}
                onChange={(e) => setCostLimits(prev => ({ ...prev, emergencyThreshold: parseInt(e.target.value, 10) }))}
              />
            </div>
          </div>
          <Button onClick={updateCostLimits} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Update Cost Limits
          </Button>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Requests</span>
                <span className="font-bold">{usageStats.totalRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Requests</span>
                <span className="font-bold">{usageStats.dailyRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost</span>
                <span className="font-bold">${usageStats.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Cost</span>
                <span className="font-bold">${usageStats.monthlyCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Cost Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monthly Budget Usage</span>
                <span className="font-bold">{getCostPercentage().toFixed(1)}%</span>
              </div>
              <Progress value={getCostPercentage()} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${usageStats.totalCost.toFixed(2)}</span>
                <span>${costLimits.monthlyBudget}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Request Usage</span>
                <span className="font-bold">{getDailyUsagePercentage().toFixed(1)}%</span>
              </div>
              <Progress value={getDailyUsagePercentage()} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{usageStats.dailyRequests}</span>
                <span>{costLimits.dailyLimit}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Use these controls only in emergency situations when costs exceed limits.
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-4">
            <Button 
              variant="destructive" 
              onClick={emergencyStop}
              disabled={isLoading || systemStatus.emergencyMode}
            >
              <Zap className="w-4 h-4 mr-2" />
              Emergency Stop
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetDailyCounters}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Daily Counters
            </Button>
          </div>
          
          {systemStatus.emergencyMode && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Emergency mode is active. AI service has been temporarily disabled.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 