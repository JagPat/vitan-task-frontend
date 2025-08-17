import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappApi, SendMessageData } from '../api';
import { showSuccess, showError } from '../../../stores/toastStore';

export const WhatsAppView: React.FC = () => {
  const [testMessage, setTestMessage] = useState<SendMessageData>({
    to: '',
    type: 'text',
    content: '',
  });
  
  const queryClient = useQueryClient();

  // Fetch WhatsApp health
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['whatsapp-health'],
    queryFn: whatsappApi.getHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['whatsapp-templates'],
    queryFn: whatsappApi.getTemplates,
  });

  // Fetch queue status
  const { data: queueStatus, isLoading: queueLoading } = useQuery({
    queryKey: ['whatsapp-queue'],
    queryFn: whatsappApi.getQueueStatus,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Send test message mutation
  const sendMessageMutation = useMutation({
    mutationFn: whatsappApi.sendMessage,
    onSuccess: (data) => {
      showSuccess(`Test message sent successfully! Message ID: ${data.messageId}`);
      setTestMessage({ to: '', type: 'text', content: '' });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-queue'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Failed to send test message');
    },
  });

  // Clear queue mutation
  const clearQueueMutation = useMutation({
    mutationFn: whatsappApi.clearDeadLetterQueue,
    onSuccess: () => {
      showSuccess('Dead letter queue cleared successfully');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-queue'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Failed to clear queue');
    },
  });

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (testMessage.to && testMessage.content) {
      sendMessageMutation.mutate(testMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">WhatsApp Integration</h1>

      {/* Health Status Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Service Health</h2>
        {healthLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : health ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(health.status)}`}>
                {health.status}
              </span>
              <span className="text-sm text-gray-600">{health.service}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Rate Limits</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Per Recipient: {health.rateLimits.perTo}/min</div>
                  <div>Per IP: {health.rateLimits.perIP}/min</div>
                  <div>Webhook: {health.rateLimits.webhookPerIP}/min</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Retry Config</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Max Attempts: {health.retryConfig.maxAttempts}</div>
                  <div>Backoff: {health.retryConfig.backoffMs}ms</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Configuration</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>API Version: {health.config.apiVersion}</div>
                  <div>Phone Number: {health.config.phoneNumberId}</div>
                  <div>Webhook: {health.config.webhookVerification}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-600">Failed to load health status</div>
        )}
      </div>

      {/* Test Message Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Send Test Message</h2>
        <form onSubmit={handleSendTestMessage} className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Number *
            </label>
            <input
              id="to"
              type="tel"
              value={testMessage.to}
              onChange={(e) => setTestMessage(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
              required
              disabled={sendMessageMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Message Type
            </label>
            <select
              id="type"
              value={testMessage.type}
              onChange={(e) => setTestMessage(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sendMessageMutation.isPending}
            >
              <option value="text">Text Message</option>
              <option value="template">Template Message</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Message Content *
            </label>
            <textarea
              id="content"
              value={testMessage.content}
              onChange={(e) => setTestMessage(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message"
              rows={3}
              required
              disabled={sendMessageMutation.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={sendMessageMutation.isPending || !testMessage.to || !testMessage.content}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendMessageMutation.isPending ? 'Sending...' : 'Send Test Message'}
          </button>
        </form>
      </div>

      {/* Templates List */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Message Templates</h2>
        {templatesLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : templates?.templates && templates.templates.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {templates.templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Language: {template.language}</div>
                  <div>Status: {template.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">No templates available</div>
        )}
      </div>

      {/* Queue Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Queue Status</h2>
          {queueStatus?.deadLetterQueue?.count && queueStatus.deadLetterQueue.count > 0 && (
            <button
              onClick={() => clearQueueMutation.mutate()}
              disabled={clearQueueMutation.isPending}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {clearQueueMutation.isPending ? 'Clearing...' : 'Clear DLQ'}
            </button>
          )}
        </div>
        
        {queueLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : queueStatus ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                queueStatus.queueStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {queueStatus.queueStatus}
              </span>
              <span className="text-sm text-gray-600">Queue Status</span>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Dead Letter Queue</h4>
              <div className="text-sm text-gray-600">
                Failed Messages: {queueStatus.deadLetterQueue.count}
              </div>
              {queueStatus.deadLetterQueue.count > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Last updated: {new Date(queueStatus.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Failed to load queue status</div>
        )}
      </div>
    </div>
  );
};
