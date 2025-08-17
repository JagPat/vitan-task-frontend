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
    new winston.transports.File({ filename: 'events-api.log' })
  ]
});

/**
 * @route   GET /api/events
 * @desc    Get paginated event stream (recent events)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Get event router from app locals (injected by modular system)
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const events = eventRouter.getEventHistory(parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: {
        events,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: events.length
        }
      }
    });
  } catch (error) {
    logger.error('Failed to get event history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event history'
    });
  }
});

/**
 * @route   GET /api/events/counters
 * @desc    Get event counts and statistics
 * @access  Public
 */
router.get('/counters', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const stats = eventRouter.getStats();
    
    res.json({
      success: true,
      data: {
        performance: stats.performance,
        queue: stats.queue,
        events: {
          total: stats.events.total,
          byType: stats.events.byType,
          lastEmittedAt: stats.events.lastEmittedAt
        },
        modules: stats.modules,
        routes: stats.routes
      }
    });
  } catch (error) {
    logger.error('Failed to get event counters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event statistics'
    });
  }
});

/**
 * @route   GET /api/events/types
 * @desc    Get list of all registered event types
 * @access  Public
 */
router.get('/types', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const stats = eventRouter.getStats();
    const eventTypes = Object.keys(stats.events.byType);
    
    res.json({
      success: true,
      data: {
        eventTypes,
        total: eventTypes.length,
        categories: {
          auth: eventTypes.filter(type => type.startsWith('auth:')),
          user: eventTypes.filter(type => type.startsWith('user:')),
          task: eventTypes.filter(type => type.startsWith('task:')),
          project: eventTypes.filter(type => type.startsWith('project:')),
          system: eventTypes.filter(type => !type.includes(':'))
        }
      }
    });
  } catch (error) {
    logger.error('Failed to get event types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event types'
    });
  }
});

/**
 * @route   GET /api/events/health
 * @desc    Get event system health status
 * @access  Public
 */
router.get('/health', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const health = eventRouter.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Failed to get event health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event system health'
    });
  }
});

/**
 * @route   GET /api/events/modules/:moduleName
 * @desc    Get event statistics for a specific module
 * @access  Public
 */
router.get('/modules/:moduleName', async (req, res, next) => {
  try {
    const { moduleName } = req.params;
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const moduleStats = eventRouter.getModuleStats(moduleName);
    
    if (!moduleStats) {
      return res.status(404).json({
        success: false,
        error: `Module '${moduleName}' not found`
      });
    }
    
    res.json({
      success: true,
      data: {
        moduleName,
        stats: moduleStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Failed to get module stats for ${req.params.moduleName}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve module statistics'
    });
  }
});

/**
 * @route   POST /api/events/emit
 * @desc    Manually emit an event (for testing/debugging)
 * @access  Public (should be restricted in production)
 */
router.post('/emit', async (req, res, next) => {
  try {
    const { event, data, options = {} } = req.body;
    
    if (!event) {
      return res.status(400).json({
        success: false,
        error: 'Event name is required'
      });
    }
    
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    // Add source module for tracking
    const emitOptions = {
      ...options,
      sourceModule: 'api',
      correlationId: `manual_${Date.now()}`
    };
    
    await eventRouter.emit(event, data, emitOptions);
    
    res.json({
      success: true,
      data: {
        event,
        emitted: true,
        timestamp: new Date().toISOString(),
        correlationId: emitOptions.correlationId
      }
    });
  } catch (error) {
    logger.error('Failed to emit manual event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to emit event'
    });
  }
});

/**
 * @route   DELETE /api/events/history
 * @desc    Clear event history (for testing/debugging)
 * @access  Public (should be restricted in production)
 */
router.delete('/history', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    eventRouter.clearHistory();
    
    res.json({
      success: true,
      data: {
        message: 'Event history cleared',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to clear event history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear event history'
    });
  }
});

/**
 * @route   POST /api/events/reset-stats
 * @desc    Reset all event statistics (for testing/debugging)
 * @access  Public (should be restricted in production)
 */
router.post('/reset-stats', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    eventRouter.resetStats();
    
    res.json({
      success: true,
      data: {
        message: 'Event statistics reset',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to reset event stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset event statistics'
    });
  }
});

/**
 * @route   GET /api/events/queue
 * @desc    Get current event queue status
 * @access  Public
 */
router.get('/queue', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const stats = eventRouter.getStats();
    
    res.json({
      success: true,
      data: {
        queue: stats.queue,
        performance: {
          totalEvents: stats.performance.totalEvents,
          lastEventAt: stats.performance.lastEventAt
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to get queue status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve queue status'
    });
  }
});



// GET /api/events/stats - Event statistics (alias for counters)
router.get('/stats', async (req, res, next) => {
  try {
    const eventRouter = req.app.locals.eventRouter;
    
    if (!eventRouter) {
      return res.status(503).json({
        success: false,
        error: 'Event system not available'
      });
    }
    
    const stats = eventRouter.getStats();
    
    res.json({
      success: true,
      data: {
        performance: stats.performance,
        queue: stats.queue,
        events: {
          total: stats.events.total,
          byType: stats.events.byType,
          lastEmittedAt: stats.events.lastEmittedAt
        },
        modules: stats.modules,
        routes: stats.routes
      }
    });
  } catch (error) {
    logger.error('Failed to get event stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event statistics'
    });
  }
});

module.exports = router;
