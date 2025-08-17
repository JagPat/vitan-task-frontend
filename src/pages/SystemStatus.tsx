import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

interface ModuleInfo {
  name: string;
  version: string;
  status: string;
  description: string;
}

export const SystemStatus: React.FC = () => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Fetch modules status
  const { data: modulesResponse, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api('/api/modules'),
    refetchInterval: 30000,
  });

  // Fetch event statistics
  const { data: eventStatsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ['event-stats'],
    queryFn: () => api('/api/events/counters'),
    refetchInterval: 10000,
  });

  // Fetch WhatsApp health
  const { data: whatsappHealthResponse, isLoading: whatsappLoading } = useQuery({
    queryKey: ['whatsapp-health'],
    queryFn: () => api('/api/modules/whatsapp/health'),
    refetchInterval: 15000,
  });

  const modules = modulesResponse?.data?.modules;
  const eventStats = eventStatsResponse?.data;
  const whatsappHealth = whatsappHealthResponse?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initialized':
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
      case 'starting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
      case 'unhealthy':
      case 'stopped':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'initialized':
      case 'healthy':
        return 'Active';
      case 'degraded':
        return 'Degraded';
      case 'starting':
        return 'Starting';
      case 'error':
      case 'unhealthy':
        return 'Error';
      case 'stopped':
        return 'Stopped';
      default:
        return status;
    }
  };

  if (modulesLoading || eventsLoading || whatsappLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          {showRawJson ? 'Hide' : 'Show'} Raw JSON
        </button>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modules Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules</h2>
          <div className="space-y-3">
            {modules?.slice(0, 5).map((module: ModuleInfo) => (
              <div key={module.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{module.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(module.status)}`}>
                  {getStatusLabel(module.status)}
                </span>
              </div>
            ))}
            {modules && modules.length > 5 && (
              <div className="text-sm text-gray-500 text-center pt-2">
                +{modules.length - 5} more modules
              </div>
            )}
          </div>
        </div>

        {/* Event Statistics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Events</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Events</span>
              <span className="text-sm font-medium text-gray-900">{eventStats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Routes</span>
              <span className="text-sm font-medium text-gray-900">{eventStats?.routes?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Event</span>
              <span className="text-sm text-gray-900">
                {eventStats?.lastEmittedAt ? new Date(eventStats.lastEmittedAt).toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Health */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(whatsappHealth?.status)}`}>
                {getStatusLabel(whatsappHealth?.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium text-gray-900">v{whatsappHealth?.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">API Version</span>
              <span className="text-sm font-medium text-gray-900">{whatsappHealth?.service?.config?.apiVersion || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw JSON Data */}
      {showRawJson && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Raw Data</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Modules</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(modulesResponse, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Event Stats</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(eventStatsResponse, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">WhatsApp Health</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(whatsappHealthResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};
