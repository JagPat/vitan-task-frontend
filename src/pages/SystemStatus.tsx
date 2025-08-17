import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

interface ModuleInfo {
  name: string;
  version: string;
  status: string;
  description: string;
  error?: string;
  lastError?: string;
}

export const SystemStatus: React.FC = () => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Fetch modules status
  const { data: modulesResponse, isLoading: modulesLoading, error: modulesError } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api('/api/modules'),
    refetchInterval: 30000,
  });

  // Fetch event statistics
  const { data: eventStatsResponse, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['event-stats'],
    queryFn: () => api('/api/events/counters'),
    refetchInterval: 10000,
  });

  // Fetch WhatsApp health
  const { data: whatsappHealthResponse, isLoading: whatsappLoading, error: whatsappError } = useQuery({
    queryKey: ['whatsapp-health'],
    queryFn: () => api('/api/modules/whatsapp/health'),
    refetchInterval: 15000,
  });

  const modules = modulesResponse?.data?.modules;
  const eventStats = eventStatsResponse?.data;
  const whatsappHealth = whatsappHealthResponse?.data;

  const getStatusColor = (status: string, hasError?: boolean) => {
    if (hasError) return 'bg-red-100 text-red-800 border-red-200';
    
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

  const getStatusLabel = (status: string, hasError?: boolean) => {
    if (hasError) return 'Error';
    
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

  const getOverallStatus = () => {
    if (modulesError || eventsError || whatsappError) return 'error';
    if (modulesLoading || eventsLoading || whatsappLoading) return 'loading';
    
    const hasErrors = modules?.some((m: ModuleInfo) => m.status === 'error' || m.error) || 
                     whatsappHealth?.status === 'error';
    
    if (hasErrors) return 'degraded';
    return 'healthy';
  };

  if (modulesLoading || eventsLoading || whatsappLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overallStatus = getOverallStatus();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Overall Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(overallStatus)}`}>
            {overallStatus === 'healthy' ? '🟢 All Systems Operational' : 
             overallStatus === 'degraded' ? '🟡 System Degraded' : 
             overallStatus === 'error' ? '🔴 System Error' : '⏳ Loading...'}
          </span>
        </div>
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          {showRawJson ? 'Hide' : 'Show'} Raw JSON
        </button>
      </div>

      {/* Error Summary */}
      {(modulesError || eventsError || whatsappError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Connection Issues Detected</h3>
          <div className="space-y-1 text-sm text-red-700">
            {modulesError && <div>• Modules API: {modulesError.message}</div>}
            {eventsError && <div>• Events API: {eventsError.message}</div>}
            {whatsappError && <div>• WhatsApp API: {whatsappError.message}</div>}
          </div>
        </div>
      )}

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modules Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modules</h3>
          {modulesError ? (
            <div className="text-red-600 text-sm">Failed to load modules</div>
          ) : (
            <div className="space-y-3">
              {modules?.map((module: ModuleInfo) => (
                <div key={module.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{module.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(module.status, !!module.error)}`}>
                    {getStatusLabel(module.status, !!module.error)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events</h3>
          {eventsError ? (
            <div className="text-red-600 text-sm">Failed to load events</div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {eventStats?.totalEvents || 0}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
          )}
        </div>

        {/* WhatsApp Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp</h3>
          {whatsappError ? (
            <div className="text-red-600 text-sm">Failed to load WhatsApp status</div>
          ) : (
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(whatsappHealth?.status)}`}>
                {getStatusLabel(whatsappHealth?.status)}
              </span>
              {whatsappHealth?.lastError && (
                <div className="text-xs text-red-600 mt-2">
                  Last Error: {whatsappHealth.lastError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Raw JSON Data */}
      {showRawJson && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw API Responses</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Modules</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-auto">
                {JSON.stringify(modulesResponse, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Events</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-auto">
                {JSON.stringify(eventStatsResponse, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">WhatsApp Health</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-auto">
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
