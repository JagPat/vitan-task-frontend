const winston = require('winston');
const crypto = require('crypto');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'otp.log' })
  ]
});

class OTPService {
  constructor() {
    // In-memory storage for OTPs (in production, use Redis or database)
    this.otpStore = new Map();
    this.verifiedUsers = new Set();
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create OTP for user
  async createOTP(phoneNumber, email, type = 'whatsapp') {
    try {
      const otp = this.generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      const otpRecord = {
        otp,
        phoneNumber,
        email,
        type,
        expiry,
        attempts: 0,
        created: new Date()
      };

      this.otpStore.set(phoneNumber, otpRecord);
      
      logger.info('OTP created successfully', { phoneNumber, type });
      return otpRecord;
    } catch (error) {
      logger.error('Error creating OTP', { error: error.message, phoneNumber });
      throw error;
    }
  }

  // Send WhatsApp OTP (mock implementation)
  async sendWhatsAppOTP(phoneNumber, otp) {
    try {
      // In production, integrate with WhatsApp Business API to send OTP
      logger.info('WhatsApp OTP sent', { phoneNumber, otp });
      
      // Mock successful send
      return {
        success: true,
        messageId: `otp_${Date.now()}`,
        phoneNumber
      };
    } catch (error) {
      logger.error('Error sending WhatsApp OTP', { error: error.message, phoneNumber });
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber, inputOTP, type = 'whatsapp') {
    try {
      const otpRecord = this.otpStore.get(phoneNumber);
      
      if (!otpRecord) {
        return {
          success: false,
          message: 'No OTP found for this phone number'
        };
      }

      // Check expiry
      if (new Date() > otpRecord.expiry) {
        this.otpStore.delete(phoneNumber);
        return {
          success: false,
          message: 'OTP has expired'
        };
      }

      // Check attempts
      if (otpRecord.attempts >= 3) {
        this.otpStore.delete(phoneNumber);
        return {
          success: false,
          message: 'Too many failed attempts'
        };
      }

      // Verify OTP
      if (otpRecord.otp === inputOTP) {
        this.verifiedUsers.add(phoneNumber);
        this.otpStore.delete(phoneNumber);
        
        logger.info('OTP verified successfully', { phoneNumber });
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        otpRecord.attempts += 1;
        this.otpStore.set(phoneNumber, otpRecord);
        
        return {
          success: false,
          message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining`
        };
      }
    } catch (error) {
      logger.error('Error verifying OTP', { error: error.message, phoneNumber });
      throw error;
    }
  }

  // Check if user is verified
  async isUserVerified(phoneNumber) {
    try {
      const isVerified = this.verifiedUsers.has(phoneNumber);
      logger.info('User verification check', { phoneNumber, isVerified });
      return isVerified;
    } catch (error) {
      logger.error('Error checking user verification', { error: error.message, phoneNumber });
      return false;
    }
  }

  // Remove verification (for testing)
  async removeVerification(phoneNumber) {
    this.verifiedUsers.delete(phoneNumber);
    this.otpStore.delete(phoneNumber);
    logger.info('User verification removed', { phoneNumber });
  }

  // Get OTP info (for debugging)
  getOTPInfo(phoneNumber) {
    return this.otpStore.get(phoneNumber);
  }
}

module.exports = new OTPService();