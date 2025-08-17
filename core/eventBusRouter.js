const winston = require('winston');
const EventEmitter = require('events');

class EventBusRouter extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      maxEventHistory: options.maxEventHistory || 500,
      maxQueueSize: options.maxQueueSize || 1000,
      enableQueuing: options.enableQueuing !== false
    };
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()]
    });
    
    this.eventHistory = [];
    this.eventCounters = new Map();
    this.moduleEventStats = new Map();
    this.eventQueue = [];
    this.processingQueue = false;
    
    this.queueStats = {
      totalQueued: 0,
      totalProcessed: 0,
      totalDropped: 0,
      currentSize: 0
    };
    
    this.performanceMetrics = {
      totalEvents: 0,
      lastEventAt: null,
      errors: 0
    };
    
    this.logger.info('EventBusRouter initialized');
  }
  
  on(event, callback, options = {}) {
    super.on(event, callback);
    this.logger.debug(`Listener registered for event '${event}'`);
  }
  
  async emit(event, data, options = {}) {
    const sourceModule = options.sourceModule || 'unknown';
    const correlationId = options.correlationId || `${event}_${Date.now()}`;
    
    const eventRecord = {
      id: correlationId,
      event,
      data,
      sourceModule,
      timestamp: new Date()
    };
    
    this.performanceMetrics.totalEvents++;
    this.performanceMetrics.lastEventAt = new Date();
    this.updateEventCounter(event);
    this.updateModuleStats(sourceModule, 'event_emitted', event);
    this.storeEventInHistory(eventRecord);
    
    this.logger.debug(`Emitting event '${event}'`);
    
    if (this.options.enableQueuing) {
      return this.queueEvent(event, data, eventRecord, options);
    }
    
    return this.processEventImmediately(event, data, eventRecord, options);
  }
  
  async processEventImmediately(event, data, eventRecord, options) {
    try {
      const listeners = this.listeners(event);
      
      if (listeners.length === 0) {
        this.logger.debug(`No listeners for event '${event}'`);
        return;
      }
      
      const promises = listeners.map(async (listener) => {
        try {
          await listener(data, options);
        } catch (error) {
          this.logger.error(`Error in event handler for '${event}':`, error);
          this.performanceMetrics.errors++;
        }
      });
      
      if (options.waitForAll) {
        await Promise.allSettled(promises);
      }
      
      this.logger.debug(`Event '${event}' processed successfully`);
    } catch (error) {
      this.performanceMetrics.errors++;
      this.logger.error(`Error processing event '${event}':`, error);
      throw error;
    }
  }
  
  async queueEvent(event, data, eventRecord, options) {
    if (this.eventQueue.length >= this.options.maxQueueSize) {
      this.queueStats.totalDropped++;
      this.logger.warn(`Event queue full, dropping event '${event}'`);
      return;
    }
    
    this.eventQueue.push({
      event,
      data,
      eventRecord,
      options,
      queuedAt: new Date()
    });
    
    this.queueStats.totalQueued++;
    this.queueStats.currentSize = this.eventQueue.length;
    
    this.logger.debug(`Event '${event}' queued`);
    
    if (!this.processingQueue) {
      this.processQueue();
    }
    
    return eventRecord.id;
  }
  
  async processQueue() {
    if (this.processingQueue || this.eventQueue.length === 0) {
      return;
    }
    
    this.processingQueue = true;
    
    while (this.eventQueue.length > 0) {
      const queuedEvent = this.eventQueue.shift();
      this.queueStats.currentSize = this.eventQueue.length;
      
      try {
        await this.processEventImmediately(
          queuedEvent.event,
          queuedEvent.data,
          queuedEvent.eventRecord,
          queuedEvent.options
        );
        
        this.queueStats.totalProcessed++;
      } catch (error) {
        this.logger.error(`Error processing queued event '${queuedEvent.event}':`, error);
        this.performanceMetrics.errors++;
      }
    }
    
    this.processingQueue = false;
    this.logger.debug('Event queue processing completed');
  }
  
  updateEventCounter(event) {
    const currentCount = this.eventCounters.get(event) || 0;
    this.eventCounters.set(event, currentCount + 1);
  }
  
  updateModuleStats(moduleName, action, event) {
    if (!this.moduleEventStats.has(moduleName)) {
      this.moduleEventStats.set(moduleName, {
        eventsEmitted: 0,
        lastActivity: null,
        eventTypes: new Set()
      });
    }
    
    const stats = this.moduleEventStats.get(moduleName);
    stats.lastActivity = new Date();
    stats.eventTypes.add(event);
    
    if (action === 'event_emitted') {
      stats.eventsEmitted++;
    }
  }
  
  storeEventInHistory(eventRecord) {
    this.eventHistory.push(eventRecord);
    
    if (this.eventHistory.length > this.options.maxEventHistory) {
      this.eventHistory.shift();
    }
  }
  
  getStats() {
    return {
      performance: this.performanceMetrics,
      queue: this.queueStats,
      events: {
        total: this.eventHistory.length,
        byType: Object.fromEntries(this.eventCounters),
        lastEmittedAt: this.performanceMetrics.lastEventAt
      },
      modules: Object.fromEntries(
        Array.from(this.moduleEventStats.entries()).map(([name, stats]) => [
          name,
          {
            ...stats,
            eventTypes: Array.from(stats.eventTypes)
          }
        ])
      ),
      routes: {
        total: this.eventNames().length,
        byEvent: Object.fromEntries(
          this.eventNames().map(event => [event, this.listenerCount(event)])
        )
      }
    };
  }
  
  getEventHistory(limit = 50, offset = 0) {
    const start = Math.max(0, this.eventHistory.length - limit - offset);
    const end = Math.max(0, this.eventHistory.length - offset);
    return this.eventHistory.slice(start, end);
  }
  
  getModuleStats(moduleName) {
    return this.moduleEventStats.get(moduleName) || null;
  }
  
  healthCheck() {
    const queueHealth = this.options.enableQueuing ? 
      (this.eventQueue.length < this.options.maxQueueSize * 0.8) : true;
    
    return {
      status: queueHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      queue: {
        size: this.eventQueue.length,
        maxSize: this.options.maxQueueSize,
        processing: this.processingQueue
      },
      performance: {
        totalEvents: this.performanceMetrics.totalEvents,
        errors: this.performanceMetrics.errors,
        lastEventAt: this.performanceMetrics.lastEventAt
      }
    };
  }
  
  clearHistory() {
    this.eventHistory = [];
    this.logger.info('Event history cleared');
  }
  
  resetStats() {
    this.eventCounters.clear();
    this.moduleEventStats.clear();
    this.performanceMetrics = {
      totalEvents: 0,
      lastEventAt: null,
      errors: 0
    };
    this.queueStats = {
      totalQueued: 0,
      totalProcessed: 0,
      totalDropped: 0,
      currentSize: 0
    };
    
    this.logger.info('All statistics reset');
  }
}

module.exports = EventBusRouter;
