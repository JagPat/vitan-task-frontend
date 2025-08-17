import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/apiClient';

interface ModuleInfo {
  name: string;
  version: string;
  status: string;
  description: string;
}

export const SystemView: React.FC = () => {
  // Fetch modules status
  const { data: modulesResponse, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api('/api/modules'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch event statistics
  const { data: eventStatsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ['event-stats'],
    queryFn: () => api('/api/events/counters'),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const modules = modulesResponse?.data?.modules;
  const eventStats = eventStatsResponse?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initialized': return 'bg-green-100 text-green-800';
      case 'starting': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'initialized': return 'Active';
      case 'starting': return 'Starting';
      case 'error': return 'Error';
      case 'stopped': return 'Stopped';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>

      {/* Modules Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Module Status</h2>
        {modulesLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : modules && modules.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module: ModuleInfo) => (
              <div key={module.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 capitalize">{module.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(module.status)}`}>
                    {getStatusLabel(module.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                <div className="text-xs text-gray-500">v{module.version}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-600">Failed to load module status</div>
        )}
      </div>

      {/* Event Statistics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Event Statistics</h2>
        {eventsLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : eventStats ? (
          <div className="space-y-6">
            {/* Total Events */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Total Events</h3>
              <div className="text-3xl font-bold text-blue-600">{eventStats.total}</div>
            </div>

            {/* Top Event Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Top Event Types</h3>
              <div className="space-y-2">
                {Object.entries(eventStats.byType)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([eventType, count]) => (
                    <div key={eventType} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-mono">{eventType}</span>
                      <span className="text-sm font-medium text-gray-900">{count as number}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Module Activity */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Module Activity</h3>
              <div className="space-y-3">
                {Object.entries(eventStats.modules).map(([moduleName, moduleStats]) => (
                  <div key={moduleName} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">{moduleName}</h4>
                      <span className="text-sm font-medium text-blue-600">
                        {(moduleStats as any).eventsEmitted} events
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Last Activity: {new Date((moduleStats as any).lastActivity).toLocaleString()}</div>
                      <div>Event Types: {(moduleStats as any).eventTypes.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-600">Failed to load event statistics</div>
        )}
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Backend Health */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Backend Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Operational</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Last checked: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Frontend Build */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Frontend Build</h3>
            <div className="text-sm text-gray-600">
              Environment: {import.meta.env.VITE_ENV_NAME || 'development'}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Built: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
