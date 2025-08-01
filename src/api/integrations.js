import { whatsTaskClient } from './whatsTaskClient';

// Core integrations using WhatsTask API
export const Core = {
  // Send email (placeholder for future email integration)
  async sendEmail(emailData) {
    return whatsTaskClient.request('/api/integrations/email', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  },

  // Upload file (placeholder for future file upload integration)
  async uploadFile(fileData) {
    try {
      // File upload endpoint not implemented yet
      return {
        id: Date.now(),
        name: fileData.file?.name || 'uploaded-file',
        url: '#',
        size: fileData.file?.size || 0,
        type: fileData.file?.type || 'application/octet-stream'
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },

  // Generate image (placeholder for future AI integration)
  async generateImage(prompt) {
    return whatsTaskClient.request('/api/integrations/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  // Extract data from uploaded file
  async extractDataFromUploadedFile(fileId) {
    return whatsTaskClient.request(`/api/integrations/extract/${fileId}`);
  },

  // Invoke LLM (placeholder for future AI integration)
  async invokeLLM(prompt) {
    return whatsTaskClient.request('/api/integrations/llm', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }
};

// Export individual functions for backward compatibility
export const SendEmail = Core.sendEmail;
export const UploadFile = Core.uploadFile;
export const GenerateImage = Core.generateImage;
export const ExtractDataFromUploadedFile = Core.extractDataFromUploadedFile;
export const InvokeLLM = Core.invokeLLM;






