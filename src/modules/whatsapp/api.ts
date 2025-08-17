import { api } from '../../lib/apiClient';

// Types
export interface WhatsAppHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  timestamp: string;
  config: {
    apiVersion: string;
    phoneNumberId: string;
    accessToken: string;
    webhookVerification: string;
  };
  rateLimits: {
    perTo: number;
    perIP: number;
    webhookPerIP: number;
  };
  retryConfig: {
    maxAttempts: number;
    backoffMs: number;
  };
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: string;
}

export interface SendMessageData {
  to: string;
  type: 'text' | 'template' | 'media';
  content?: string;
  template?: {
    name: string;
    language?: string;
  };
}

export interface SendMessageResponse {
  messageId: string;
  status: string;
  timestamp: string;
  to: string;
  type: string;
}

export interface QueueStatus {
  queueStatus: string;
  deadLetterQueue: {
    count: number;
    entries: any[];
  };
  timestamp: string;
}

// WhatsApp API functions
export const whatsappApi = {
  // Get service health
  getHealth: async (): Promise<WhatsAppHealth> => {
    const response = await api.get<WhatsAppHealth>('/api/modules/whatsapp/health');
    return response.data;
  },

  // Get service status
  getStatus: async () => {
    return api.get('/api/modules/whatsapp/status');
  },

  // Get message templates
  getTemplates: async (): Promise<{ templates: WhatsAppTemplate[]; total: number }> => {
    const response = await api.get<{ templates: WhatsAppTemplate[]; total: number }>('/api/modules/whatsapp/templates');
    return response.data;
  },

  // Send WhatsApp message
  sendMessage: async (messageData: SendMessageData): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>('/api/modules/whatsapp/send', messageData);
    return response.data;
  },

  // Get queue status
  getQueueStatus: async (): Promise<QueueStatus> => {
    const response = await api.get<QueueStatus>('/api/modules/whatsapp/queue');
    return response.data;
  },

  // Clear dead letter queue
  clearDeadLetterQueue: async (): Promise<{ message: string; timestamp: string }> => {
    const response = await api.post<{ message: string; timestamp: string }>('/api/modules/whatsapp/queue/clear');
    return response.data;
  },

  // Verify webhook (for setup)
  verifyWebhook: async (mode: string, token: string, challenge: string): Promise<string> => {
    const response = await api.get<string>(`/api/modules/whatsapp/webhook?hub.mode=${mode}&hub.verify_token=${token}&hub.challenge=${challenge}`);
    return response.data || '';
  },

  // Process webhook (POST endpoint)
  processWebhook: async (webhookData: any): Promise<any> => {
    const response = await api.post('/api/modules/whatsapp/webhook', webhookData);
    return response.data;
  },
};
