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

// Send task assignment notification to assigned user
export const sendTaskAssignmentNotification = async (taskData) => {
  try {
    const message = `🔔 New Task Assigned!\n\n` +
      `📋 Task: ${taskData.title}\n` +
      `📄 Description: ${taskData.description || 'No description provided'}\n` +
      `📅 Due Date: ${taskData.due_date ? new Date(taskData.due_date).toLocaleDateString() : 'No due date'}\n` +
      `⚡ Priority: ${taskData.priority || 'Medium'}\n` +
      `👤 Assigned by: ${taskData.created_by_name || 'System'}\n\n` +
      `Reply with:\n` +
      `• START - Begin working\n` +
      `• COMPLETE - Mark as done\n` +
      `• NEED HELP - Request assistance\n` +
      `• STATUS - Check current status`;

    return await whatsTaskClient.sendWhatsAppMessage(taskData.assigned_to_whatsapp, message);
  } catch (error) {
    console.error('Failed to send task assignment notification:', error);
    throw error;
  }
};

// Send task creation confirmation to creator
export const sendTaskCreationConfirmation = async (taskData) => {
  try {
    const message = `✅ Task Created Successfully!\n\n` +
      `📋 Task: ${taskData.title}\n` +
      `👤 Assigned to: ${taskData.assigned_to_name || 'External user'}\n` +
      `📱 WhatsApp: ${taskData.assigned_to_whatsapp}\n` +
      `📅 Due Date: ${taskData.due_date ? new Date(taskData.due_date).toLocaleDateString() : 'No due date'}\n` +
      `⚡ Priority: ${taskData.priority || 'Medium'}\n\n` +
      `The assigned user has been notified via WhatsApp.`;

    return await whatsTaskClient.sendWhatsAppMessage(taskData.created_by_whatsapp, message);
  } catch (error) {
    console.error('Failed to send task creation confirmation:', error);
    throw error;
  }
};

// Send task status update notification
export const sendTaskStatusUpdateNotification = async (taskData, oldStatus, newStatus) => {
  try {
    const statusEmojis = {
      'pending': '⏳',
      'in_progress': '🔄',
      'completed': '✅',
      'closed': '🔒'
    };

    const message = `📊 Task Status Updated!\n\n` +
      `📋 Task: ${taskData.title}\n` +
      `🔄 Status: ${statusEmojis[oldStatus] || '❓'} ${oldStatus} → ${statusEmojis[newStatus] || '❓'} ${newStatus}\n` +
      `👤 Updated by: ${taskData.updated_by_name || 'System'}\n\n` +
      `Use /tasks to view all your tasks.`;

    return await whatsTaskClient.sendWhatsAppMessage(taskData.assigned_to_whatsapp, message);
  } catch (error) {
    console.error('Failed to send status update notification:', error);
    throw error;
  }
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

