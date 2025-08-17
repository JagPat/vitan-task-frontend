const express = require('express');
const router = express.Router();
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth-api.log' })
  ]
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    
    if (!password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: 'Email or phone and password are required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.authenticateUser({ email, phone, password });
    
    res.json(result);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: 'Name, password, and either email or phone are required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.registerUser({ name, email, phone, password, role });
    
    res.status(201).json(result);
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify JWT token
 * @access  Public
 */
router.post('/verify', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.verifyToken(token);
    
    res.json(result);
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Token verification failed'
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.refreshToken(token);
    
    res.json(result);
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Token refresh failed'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', async (req, res, next) => {
  try {
    const { token, userId } = req.body;
    
    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Token and user ID are required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.logoutUser(token, userId);
    
    res.json(result);
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Logout failed'
    });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', async (req, res, next) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'User ID, current password, and new password are required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.updatePassword(userId, currentPassword, newPassword);
    
    res.json(result);
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Password change failed'
    });
  }
});

/**
 * @route   POST /api/auth/verify-account
 * @desc    Verify user account
 * @access  Public
 */
router.post('/verify-account', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.verifyUserAccount(userId);
    
    res.json(result);
  } catch (error) {
    logger.error('Account verification error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Account verification failed'
    });
  }
});

/**
 * @route   GET /api/auth/permissions/:userId
 * @desc    Get user permissions
 * @access  Private
 */
router.get('/permissions/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const authService = req.app.locals.authService;
    const result = await authService.getUserPermissions(parseInt(userId));
    
    res.json(result);
  } catch (error) {
    logger.error('Permissions error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to get permissions'
    });
  }
});

/**
 * @route   GET /api/auth/health
 * @desc    Get auth service health status
 * @access  Public
 */
router.get('/health', async (req, res, next) => {
  try {
    const authService = req.app.locals.authService;
    const health = await authService.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile (requires authentication)
 * @access  Private
 */
router.get('/profile', async (req, res, next) => {
  try {
    // This would typically use middleware to extract user from JWT
    // For now, we'll return a placeholder
    res.json({
      success: true,
      message: 'Profile endpoint - requires authentication middleware'
    });
  } catch (error) {
    logger.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile (requires authentication)
 * @access  Private
 */
router.put('/profile', async (req, res, next) => {
  try {
    // This would typically use middleware to extract user from JWT
    // For now, we'll return a placeholder
    res.json({
      success: true,
      message: 'Profile update endpoint - requires authentication middleware'
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;
