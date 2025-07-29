import React, { useState, useEffect } from 'react';
import { whatsTaskClient } from '@/api/whatsTaskClient';
import { Task, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      const health = await whatsTaskClient.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      setError(`Health check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Task.getAll();
      setTasks(response);
    } catch (err) {
      setError(`Get tasks failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await User.getAll();
      setUsers(response);
    } catch (err) {
      setError(`Get users failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await Task.create({
        title: 'Test Task from Frontend',
        description: 'This is a test task created from the frontend',
        priority: 'medium',
        assigned_to_whatsapp: '+1234567890',
        created_by_whatsapp: '+1234567890'
      });
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(`Create task failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test health check on component mount
    testHealthCheck();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            WhatsTask API Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Check */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                onClick={testHealthCheck} 
                disabled={loading}
                size="sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Health Check'}
              </Button>
              {healthStatus && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  ✅ Connected to Railway Backend
                </Badge>
              )}
            </div>
            {healthStatus && (
              <div className="text-sm text-slate-600">
                <p>Status: {healthStatus.status}</p>
                <p>Environment: {healthStatus.environment}</p>
                <p>Uptime: {Math.round(healthStatus.uptime)}s</p>
              </div>
            )}
          </div>

          {/* API Tests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testGetTasks} 
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Tasks'}
            </Button>
            
            <Button 
              onClick={testGetUsers} 
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Users'}
            </Button>
            
            <Button 
              onClick={testCreateTask} 
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Test Task'}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Error:</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tasks */}
            <div>
              <h3 className="font-medium mb-2">Tasks ({tasks.length})</h3>
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div key={index} className="p-2 bg-slate-50 rounded border">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-slate-600">{task.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-slate-500">No tasks found</p>
                )}
              </div>
            </div>

            {/* Users */}
            <div>
              <h3 className="font-medium mb-2">Users ({users.length})</h3>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div key={index} className="p-2 bg-slate-50 rounded border">
                    <p className="font-medium text-sm">{user.full_name}</p>
                    <p className="text-xs text-slate-600">{user.whatsapp_number}</p>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-sm text-slate-500">No users found</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 