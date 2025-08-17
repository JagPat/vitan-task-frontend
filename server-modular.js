const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Import modular architecture components
const ServiceContainer = require('./service-container');
const EventBus = require('./shared/events/eventBus');
const ModuleLoader = require('./module-loader');
const databaseConnection = require('./modules/core/database/connection');

// Import existing middleware (preserve current functionality)
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');
const { requestId } = require('./middleware/requestId');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'modular-server.log' })
  ]
});

const app = express();
// Use port 4000 to avoid collision with current server.js (port 3000)
const PORT = process.env.MODULAR_PORT || 4000;

// Initialize service container and event bus
const serviceContainer = new ServiceContainer();
const eventBus = new EventBus();

// Middleware (preserve current setup)
app.use(helmet());
app.use(cors({
  origin: [
    'https://vitan-task-frontend.up.railway.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:4000', // Allow modular server
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
    'http://127.0.0.1:3004',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Force-Delete']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestId);
app.use(requestLogger);

// Initialize core services
async function initializeCoreServices() {
  try {
    logger.info('Initializing core services...');
    
    // Initialize database connection (optional for Phase-1 testing)
    try {
      await databaseConnection.initialize();
      serviceContainer.register('database', databaseConnection);
      logger.info('Database connection initialized successfully');
    } catch (dbError) {
      logger.warn('Database connection failed (expected in Phase-1 testing):', dbError.message);
      // Create a mock database service for Phase-1 testing
      const mockDatabase = {
        healthCheck: async () => ({ status: 'mock', message: 'Database not available in Phase-1 testing' }),
        shutdown: async () => logger.info('Mock database shutdown')
      };
      serviceContainer.register('database', mockDatabase);
    }
    
    // Register core services in container
    serviceContainer.register('eventBus', eventBus);
    serviceContainer.register('logger', logger);
    
    logger.info('Core services initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize core services:', error);
    throw error;
  }
}

// Initialize modules
async function initializeModules() {
  try {
    logger.info('Initializing modules...');
    
    // Create module loader
    const moduleLoader = new ModuleLoader('./modules');
    
    // Load all modules
    const modules = await moduleLoader.loadAllModules();
    
    // Register modules with service container
    for (const [moduleName, module] of modules) {
      serviceContainer.registerModule(moduleName, module);
    }
    
    // Initialize all modules
    await serviceContainer.initializeModules(app);
    
    logger.info(`Successfully initialized ${modules.size} modules`);
    return modules;
  } catch (error) {
    logger.error('Failed to initialize modules:', error);
    throw error;
  }
}

// Health check endpoint (enhanced for modular architecture)
app.get('/health', async (req, res) => {
  try {
    logger.info('Health check requested');
    
    // Get modular architecture health
    const modularHealth = await serviceContainer.healthCheck();
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      architecture: 'modular',
      server: 'modular',
      modules: modularHealth.modules,
      services: modularHealth.services
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Module management endpoints (for development/debugging)
app.get('/api/modules', (req, res) => {
  try {
    const modules = serviceContainer.getModules();
    const moduleList = Array.from(modules.entries()).map(([name, module]) => ({
      name,
      version: module.version,
      status: module.status,
      description: module.description,
      registeredAt: module.registeredAt,
      hasHealthMethod: typeof module.health === 'function',
      hasInitializeMethod: typeof module.initialize === 'function',
      dependencies: module.dependencies || [],
      provides: module.provides || []
    }));
    
    res.json({
      success: true,
      data: moduleList,
      count: moduleList.length,
      debug: {
        serviceContainerStatus: 'active',
        totalServices: serviceContainer.getServiceNames().length,
        availableServices: serviceContainer.getServiceNames()
      }
    });
  } catch (error) {
    logger.error('Failed to get modules:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint to see module details
app.get('/api/modules/:moduleName/debug', (req, res) => {
  try {
    const { moduleName } = req.params;
    const module = serviceContainer.getModule(moduleName);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Module '${moduleName}' not found`,
        availableModules: Array.from(serviceContainer.getModules().keys())
      });
    }
    
    res.json({
      success: true,
      data: {
        name: module.name,
        version: module.version,
        status: module.status,
        description: module.description,
        registeredAt: module.registeredAt,
        initializedAt: module.initializedAt,
        startedAt: module.startedAt,
        stoppedAt: module.stoppedAt,
        error: module.error,
        methods: {
          hasHealth: typeof module.health === 'function',
          hasInitialize: typeof module.initialize === 'function',
          hasStart: typeof module.start === 'function',
          hasStop: typeof module.stop === 'function'
        },
        dependencies: module.dependencies || [],
        provides: module.provides || [],
        services: module.services || {},
        routes: module.routes ? 'registered' : 'not_registered'
      }
    });
  } catch (error) {
    logger.error(`Failed to get module debug info for ${req.params.moduleName}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/modules/:moduleName/health', async (req, res) => {
  try {
    const { moduleName } = req.params;
    logger.info(`Module health check requested for: ${moduleName}`);
    
    const module = serviceContainer.getModule(moduleName);
    
    if (!module) {
      logger.warn(`Module '${moduleName}' not found in service container`);
      return res.status(404).json({
        success: false,
        error: `Module '${moduleName}' not found`,
        availableModules: Array.from(serviceContainer.getModules().keys())
      });
    }
    
    logger.info(`Module '${moduleName}' found, calling health method`, {
      moduleStatus: module.status,
      hasHealthMethod: typeof module.health === 'function'
    });
    
    // Check if the module has a health method
    if (typeof module.health !== 'function') {
      logger.warn(`Module '${moduleName}' does not have a health method`);
      return res.status(500).json({
        success: false,
        error: `Module '${moduleName}' does not have a health method`,
        moduleInfo: {
          name: module.name,
          version: module.version,
          status: module.status
        }
      });
    }
    
    // Call the module's health method
    const health = await module.health();
    
    logger.info(`Module '${moduleName}' health check completed`, {
      healthStatus: health.status
    });
    
    res.json({
      success: true,
      data: health,
      moduleName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Failed to get module health for ${req.params.moduleName}:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      moduleName: req.params.moduleName,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint (preserve current functionality)
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsTask Modular API Server',
    version: '2.0.0',
    architecture: 'modular',
    server: 'modular',
    port: PORT,
    endpoints: {
      health: '/health',
      modules: '/api/modules',
      'module-health': '/api/modules/:moduleName/health',
      'module-debug': '/api/modules/:moduleName/debug'
    },
    documentation: 'Frontend should be deployed separately',
    note: 'This is the modular server running on port 4000. The main server runs on port 3000.',
    phase: 'Phase-2: Tasks module migrated to modular architecture'
  });
});

// Error handling middleware (preserve current setup)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { path: req.originalUrl });
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    server: 'modular',
    port: PORT
  });
});

// Start server
async function startServer() {
  try {
    // Initialize core services
    await initializeCoreServices();
    
    // Initialize modules
    await initializeModules();
    
    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`WhatsTask Modular backend server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check available at: http://0.0.0.0:${PORT}/health`);
      logger.info(`Module management at: http://0.0.0.0:${PORT}/api/modules`);
      logger.info(`Main server continues running on port 3000`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      
      try {
        await serviceContainer.shutdown();
        server.close(() => {
          logger.info('Modular server closed');
          process.exit(0);
        });
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
      
      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    });
    
    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      
      try {
        await serviceContainer.shutdown();
        server.close(() => {
          logger.info('Modular server closed');
          process.exit(0);
        });
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    });
    
    return server;
  } catch (error) {
    logger.error('Failed to start modular server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch(error => {
    logger.error('Failed to start modular server:', error);
    process.exit(1);
  });
}

module.exports = { app, startServer, serviceContainer, eventBus };
