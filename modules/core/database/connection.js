const { Pool } = require('pg');

/**
 * Shared Database Connection Manager
 * Provides centralized database connection management for all modules
 */
class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.logger = null; // Will be set by setLogger method
    
    this.stats = {
      connectionsCreated: 0,
      connectionsActive: 0,
      connectionsIdle: 0,
      totalQueries: 0,
      failedQueries: 0,
      lastQueryTime: null
    };
  }

  /**
   * Set the logger instance (called by service container)
   */
  setLogger(logger) {
    this.logger = logger;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    try {
      if (!this.logger) {
        console.warn('Logger not set, using console fallback');
        this.logger = console;
      }

      this.logger.info('Initializing database connection...');
      
      // Get database configuration from environment
      const dbUrl = process.env.DATABASE_URL;
      const dbPublicUrl = process.env.DATABASE_PUBLIC_URL;
      
      if (!dbUrl) {
        throw new Error('DATABASE_URL environment variable is required');
      }

      // Create connection pool
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });

      // Test connection
      const client = await this.pool.connect();
      this.logger.info('Database connection test successful');
      client.release();

      this.logger.info('Database connection initialized successfully');
      return true;

    } catch (error) {
      if (this.logger) {
        this.logger.error('Failed to initialize database connection:', error);
      } else {
        console.error('Failed to initialize database connection:', error);
      }
      throw error;
    }
  }

  /**
   * Get database pool
   */
  getPool() {
    return this.pool;
  }

  /**
   * Execute a query
   */
  async query(text, params) {
    try {
      if (!this.pool) {
        throw new Error('Database not initialized');
      }

      this.stats.totalQueries++;
      this.stats.lastQueryTime = new Date();

      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (this.logger) {
        this.logger.info('Database query executed', {
          query: text,
          duration,
          rows: result.rowCount
        });
      }

      return result;

    } catch (error) {
      this.stats.failedQueries++;
      
      if (this.logger) {
        this.logger.error('Database query failed:', error);
      } else {
        console.error('Database query failed:', error);
      }
      
      throw error;
    }
  }

  /**
   * Get connection statistics
   */
  getStats() {
    if (this.pool) {
      this.stats.connectionsActive = this.pool.totalCount - this.pool.idleCount;
      this.stats.connectionsIdle = this.pool.idleCount;
    }
    return this.stats;
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      if (!this.pool) {
        return { status: 'unhealthy', message: 'Database not initialized' };
      }

      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();

      return { 
        status: 'healthy', 
        message: 'Database connection is working',
        stats: this.getStats()
      };

    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: error.message,
        stats: this.getStats()
      };
    }
  }

  /**
   * Shutdown database connections
   */
  async shutdown() {
    try {
      if (this.pool) {
        await this.pool.end();
        if (this.logger) {
          this.logger.info('Database connections closed');
        }
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Error during database shutdown:', error);
      }
    }
  }
}

module.exports = new DatabaseConnection();
