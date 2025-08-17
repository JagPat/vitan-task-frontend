const winston = require('winston');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Authentication Service
 * Handles user authentication, authorization, and session management
 */
class AuthService {
  constructor(database, eventBus) {
    this.database = database;
    this.eventBus = eventBus;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'auth-service.log' })
      ]
    });
    
    // JWT configuration
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    this.logger.info('AuthService initialized');
  }

  /**
   * Authenticate user with email/phone and password
   * @param {Object} credentials - User credentials
   * @returns {Object} Authentication result
   */
  async authenticateUser(credentials) {
    try {
      const { email, phone, password } = credentials;
      
      if (!password) {
        throw new Error('Password is required');
      }
      
      // Build query based on provided identifier
      let query, params;
      if (email) {
        query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
        params = [email];
      } else if (phone) {
        query = 'SELECT * FROM users WHERE phone = $1 AND is_active = true';
        params = [phone];
      } else {
        throw new Error('Email or phone is required');
      }
      
      const client = await this.database.getClient();
      const result = await client.query(query, params);
      client.release();
      
      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const user = result.rows[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }
      
      // Generate JWT token
      const token = this.generateJWT(user);
      
      // Emit login event
      await this.eventBus.emit('auth:login', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        timestamp: new Date()
      }, { sourceModule: 'auth' });
      
      this.logger.info('User authenticated successfully', { userId: user.id });
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
          is_verified: user.is_verified
        },
        token,
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Registration result
   */
  async registerUser(userData) {
    try {
      const { name, email, phone, password, role = 'user' } = userData;
      
      // Validate required fields
      if (!name || !password || (!email && !phone)) {
        throw new Error('Name, password, and either email or phone are required');
      }
      
      // Check if user already exists
      const existingUser = await this.checkUserExists(email, phone);
      if (existingUser) {
        throw new Error('User already exists with this email or phone');
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Insert new user
      const client = await this.database.getClient();
      const query = `
        INSERT INTO users (name, email, phone, password_hash, role, is_active, is_verified, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
      `;
      
      const params = [name, email, phone, passwordHash, role, true, false];
      const result = await client.query(query, params);
      client.release();
      
      const newUser = result.rows[0];
      
      // Emit user created event
      await this.eventBus.emit('user:created', {
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        timestamp: new Date()
      }, { sourceModule: 'auth' });
      
      this.logger.info('User registered successfully', { userId: newUser.id });
      
      return {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          is_verified: newUser.is_verified
        },
        message: 'User registered successfully. Please verify your account.'
      };
    } catch (error) {
      this.logger.error('User registration failed:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return {
        success: true,
        user: decoded
      };
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateJWT(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.is_verified
    };
    
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  /**
   * Refresh JWT token
   * @param {string} token - Current JWT token
   * @returns {Object} New token
   */
  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { ignoreExpiration: true });
      
      // Check if user still exists and is active
      const client = await this.database.getClient();
      const result = await client.query(
        'SELECT * FROM users WHERE id = $1 AND is_active = true',
        [decoded.userId]
      );
      client.release();
      
      if (result.rows.length === 0) {
        throw new Error('User not found or inactive');
      }
      
      const user = result.rows[0];
      const newToken = this.generateJWT(user);
      
      this.logger.info('Token refreshed successfully', { userId: user.id });
      
      return {
        success: true,
        token: newToken,
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate token)
   * @param {string} token - JWT token to invalidate
   * @param {number} userId - User ID
   * @returns {Object} Logout result
   */
  async logoutUser(token, userId) {
    try {
      // Emit logout event
      await this.eventBus.emit('auth:logout', {
        userId,
        token,
        timestamp: new Date()
      }, { sourceModule: 'auth' });
      
      this.logger.info('User logged out successfully', { userId });
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      this.logger.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Check if user exists
   * @param {string} email - User email
   * @param {string} phone - User phone
   * @returns {boolean} True if user exists
   */
  async checkUserExists(email, phone) {
    try {
      const client = await this.database.getClient();
      let query, params;
      
      if (email && phone) {
        query = 'SELECT id FROM users WHERE email = $1 OR phone = $2';
        params = [email, phone];
      } else if (email) {
        query = 'SELECT id FROM users WHERE email = $1';
        params = [email];
      } else if (phone) {
        query = 'SELECT id FROM users WHERE phone = $1';
        params = [phone];
      } else {
        return false;
      }
      
      const result = await client.query(query, params);
      client.release();
      
      return result.rows.length > 0;
    } catch (error) {
      this.logger.error('Error checking user existence:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Object} Update result
   */
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user
      const client = await this.database.getClient();
      const userResult = await client.query(
        'SELECT password_hash FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        client.release();
        throw new Error('User not found');
      }
      
      const user = userResult.rows[0];
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        client.release();
        throw new Error('Current password is incorrect');
      }
      
      // Hash new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newPasswordHash, userId]
      );
      client.release();
      
      // Emit password change event
      await this.eventBus.emit('auth:password-changed', {
        userId,
        timestamp: new Date()
      }, { sourceModule: 'auth' });
      
      this.logger.info('Password updated successfully', { userId });
      
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      this.logger.error('Password update failed:', error);
      throw error;
    }
  }

  /**
   * Verify user account (e.g., after OTP verification)
   * @param {number} userId - User ID
   * @returns {Object} Verification result
   */
  async verifyUserAccount(userId) {
    try {
      const client = await this.database.getClient();
      await client.query(
        'UPDATE users SET is_verified = true, updated_at = NOW() WHERE id = $1',
        [userId]
      );
      client.release();
      
      // Emit verification event
      await this.eventBus.emit('user:verified', {
        userId,
        timestamp: new Date()
      }, { sourceModule: 'auth' });
      
      this.logger.info('User account verified successfully', { userId });
      
      return {
        success: true,
        message: 'Account verified successfully'
      };
    } catch (error) {
      this.logger.error('Account verification failed:', error);
      throw error;
    }
  }

  /**
   * Get user permissions
   * @param {number} userId - User ID
   * @returns {Object} User permissions
   */
  async getUserPermissions(userId) {
    try {
      const client = await this.database.getClient();
      const result = await client.query(
        'SELECT role, is_verified, is_active FROM users WHERE id = $1',
        [userId]
      );
      client.release();
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = result.rows[0];
      
      // Define permissions based on role
      const permissions = {
        canCreateTasks: ['admin', 'manager', 'user'].includes(user.role),
        canDeleteTasks: ['admin', 'manager'].includes(user.role),
        canManageUsers: ['admin'].includes(user.role),
        canManageProjects: ['admin', 'manager'].includes(user.role),
        canViewAnalytics: ['admin', 'manager'].includes(user.role),
        isVerified: user.is_verified,
        isActive: user.is_active
      };
      
      return {
        success: true,
        permissions
      };
    } catch (error) {
      this.logger.error('Failed to get user permissions:', error);
      throw error;
    }
  }

  /**
   * Health check for the auth service
   * @returns {Object} Health status
   */
  async healthCheck() {
    try {
      const client = await this.database.getClient();
      await client.query('SELECT 1');
      client.release();

      return {
        status: 'healthy',
        service: 'AuthService',
        timestamp: new Date().toISOString(),
        database: 'connected',
        eventBus: this.eventBus ? 'available' : 'unavailable',
        jwt: {
          secret: this.jwtSecret ? 'configured' : 'missing',
          expiresIn: this.jwtExpiresIn
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'AuthService',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = AuthService;
