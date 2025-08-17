import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Settings,
  Activity
} from 'lucide-react';

/**
 * ModuleManager Component
 * 
 * Provides an admin interface for managing backend modules:
 * - View module status and health
 * - Enable/disable modules
 * - Monitor module performance
 * - Update module configurations
 */
const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  // Fetch modules from backend
  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://vitan-task-production.up.railway.app/api/modules');
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      const data = await response.json();
      setModules(data.modules || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check module health
  const checkModuleHealth = async (moduleName) => {
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/modules/${moduleName}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return { status: 'error', error: err.message };
    }
  };

  // Toggle module status
  const toggleModule = async (moduleName, enabled) => {
    try {
      // TODO: Implement module toggle API endpoint
      console.log(`Toggling module ${moduleName} to ${enabled}`);
      
      // Update local state
      setModules(prev => prev.map(module => 
        module.name === moduleName 
          ? { ...module, enabled: enabled }
          : module
      ));
    } catch (err) {
      console.error('Failed to toggle module:', err);
    }
  };

  // Refresh module status
  const refreshModule = async (moduleName) => {
    try {
      const health = await checkModuleHealth(moduleName);
      setModules(prev => prev.map(module => 
        module.name === moduleName 
          ? { ...module, health: health }
          : module
      ));
    } catch (err) {
      console.error('Failed to refresh module:', err);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>;
      case 'stub':
        return <Badge variant="secondary"><Info className="w-3 h-3 mr-1" />Stub</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline"><Activity className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  // Get module icon
  const getModuleIcon = (moduleName) => {
    const icons = {
      tasks: '📋',
      users: '👥',
      projects: '📁',
      auth: '🔐',
      whatsapp: '💬',
      analytics: '📊',
      ai: '🤖',
      contacts: '📞'
    };
    return icons[moduleName] || '🔧';
  };

  useEffect(() => {
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading modules...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Manager</h1>
          <p className="text-gray-600">Manage backend modules and monitor their health</p>
        </div>
        <Button onClick={fetchModules} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getModuleIcon(module.name)}</span>
                  <CardTitle className="text-lg capitalize">{module.name}</CardTitle>
                </div>
                {getStatusBadge(module.status || 'unknown')}
              </div>
              <p className="text-sm text-gray-600">{module.description || 'No description available'}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Module Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Version:</span>
                  <span className="font-mono">{module.version || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="capitalize">{module.status || 'unknown'}</span>
                </div>
                {module.initializedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Initialized:</span>
                    <span>{new Date(module.initializedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Module Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refreshModule(module.name)}
                  className="flex-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedModule(module)}
                  className="flex-1"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Details
                </Button>
              </div>

              {/* Module Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Module Enabled</span>
                <Switch
                  checked={module.enabled !== false}
                  onCheckedChange={(enabled) => toggleModule(module.name, enabled)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{getModuleIcon(selectedModule.name)}</span>
                  <CardTitle className="text-xl capitalize">{selectedModule.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedModule(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Detailed Module Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Version</h4>
                  <p className="font-mono">{selectedModule.version || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Status</h4>
                  <p className="capitalize">{selectedModule.status || 'unknown'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Description</h4>
                  <p>{selectedModule.description || 'No description available'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Initialized</h4>
                  <p>{selectedModule.initializedAt ? new Date(selectedModule.initializedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>

              {/* Dependencies */}
              {selectedModule.dependencies && selectedModule.dependencies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline">{dep}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Capabilities */}
              {selectedModule.provides && selectedModule.provides.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.provides.map((cap) => (
                      <Badge key={cap} variant="secondary">{cap}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Check */}
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Health Status</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refreshModule(selectedModule.name)}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Check Health
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;
