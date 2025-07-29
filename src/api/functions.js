import { whatsTaskClient } from './whatsTaskClient';

// WhatsApp webhook function
export const whatsappWebhook = async (webhookData) => {
  return whatsTaskClient.request('/webhook', {
    method: 'POST',
    body: JSON.stringify(webhookData),
  });
};

// Send WhatsApp message function
export const sendWhatsappMessage = async (phoneNumber, message) => {
  return whatsTaskClient.sendWhatsAppMessage(phoneNumber, message);
};

// Google Cloud webhook function
export const googleCloudWebhook = async (webhookData) => {
  return whatsTaskClient.request('/webhook/google', {
    method: 'POST',
    body: JSON.stringify(webhookData),
  });
};

// Process WhatsApp message function
export const processWhatsappMessage = async (messageData) => {
  return whatsTaskClient.request('/webhook/process', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

// Analytics functions
export const getAnalytics = async (dateRange = {}) => {
  return whatsTaskClient.getAnalytics(dateRange);
};

export const getTaskStats = async () => {
  return whatsTaskClient.getTaskStats();
};

export const getUserStats = async () => {
  return whatsTaskClient.getUserStats();
};

// Health check function
export const healthCheck = async () => {
  return whatsTaskClient.healthCheck();
};

