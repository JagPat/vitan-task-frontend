# 🏗️ **WhatsTask Architecture Documentation**

## **Overview**

WhatsTask is a modular WhatsApp API-based task management system designed for scalability, maintainability, and extensibility. The architecture follows a hybrid approach, supporting both legacy monolithic patterns and modern modular architecture simultaneously.

## **System Architecture**

### **Backend Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Hybrid Backend Server                    │
├─────────────────────────────────────────────────────────────┤
│  Legacy Routes (Backward Compatible)  │  Modular Routes    │
│  ├── /api/tasks/*                    │  ├── /api/modules   │
│  ├── /api/users/*                    │  ├── /api/modules/* │
│  ├── /api/projects/*                 │  └── /api/modules/* │
│  └── /api/auth/*                     │                     │
├─────────────────────────────────────────────────────────────┤
│                Service Container (DI)                       │
│  ├── database (fallback)            │  ├── eventBus        │
│  ├── logger                         │  └── moduleServices  │
│  └── legacyServices                 │                     │
├─────────────────────────────────────────────────────────────┤
│                Module Loader & Registry                     │
│  ├── tasks (✅ migrated)            │  ├── users (✅ migrated) │
│  ├── projects (✅ migrated)         │  ├── auth (✅ migrated)  │
│  ├── whatsapp (stub)               │  ├── ai (stub)        │
│  ├── analytics (stub)              │  └── contacts (stub)  │
└─────────────────────────────────────────────────────────────┘
```

### **Frontend Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                          │
├─────────────────────────────────────────────────────────────┤
│                Module Manager UI                           │
│  ├── Module Status Dashboard                              │
│  ├── Health Monitoring                                    │
│  └── Module Configuration                                 │
├─────────────────────────────────────────────────────────────┤
│                Feature Modules                             │
│  ├── tasks/              │  ├── users/                    │
│  ├── projects/           │  ├── auth/                     │
│  ├── whatsapp/           │  ├── analytics/                │
│  ├── ai/                 │  └── contacts/                 │
├─────────────────────────────────────────────────────────────┤
│                Shared Infrastructure                       │
│  ├── UI Components (shadcn/ui)                           │
│  ├── API Client (whatsTaskClient)                        │
│  ├── Utilities & Hooks                                   │
│  └── State Management                                    │
└─────────────────────────────────────────────────────────────┘
```

## **Module Architecture**

### **Module Interface Contract**

All modules must implement the following interface:

```javascript
module.exports = {
  // Required properties
  name: 'module-name',
  version: 'x.x.x',
  description: 'Module description',
  dependencies: ['dependency1', 'dependency2'],
  provides: ['capability1', 'capability2'],
  
  // Required methods
  async initialize(container, app, options),
  async health(),
  async debug(),
  async start(),
  async stop(),
  
  // Optional methods
  setupEventListeners(eventBus),
  handleError(error)
};
```

### **Module Lifecycle**

1. **Discovery**: ModuleLoader scans `modules/` directory
2. **Registration**: Modules registered in ServiceContainer
3. **Initialization**: Dependencies resolved, services initialized
4. **Start**: Module becomes active and handles requests
5. **Health Monitoring**: Continuous health checks via `/health` endpoints
6. **Stop**: Graceful shutdown when requested

### **Module Dependencies**

```
tasks ← database, eventBus
users ← database, eventBus, logger
projects ← database, eventBus, logger
auth ← database, eventBus, logger
whatsapp ← database, eventBus, logger
analytics ← database, eventBus, logger
ai ← database, eventBus, logger
contacts ← database, eventBus, logger
```

## **Data Flow Architecture**

### **Request Flow**

```
Frontend Request → Express Router → Module Routes → Module Service → Database
                                    ↓
                              Event Bus → Other Modules
```

### **Event-Driven Communication**

```
Module A emits event → Event Bus → Module B listens → Module B processes
```

**Example Events:**
- `task:created` → Analytics module updates metrics
- `user:verified` → WhatsApp module sends welcome message
- `project:member-added` → Notification module sends alerts

## **Database Architecture**

### **Connection Management**

- **Modular Database**: Shared PostgreSQL connection pool via `modules/core/database/connection.js`
- **Fallback Database**: Legacy `pg.Pool` instances when modular DB fails
- **Connection Pooling**: Centralized connection management with automatic cleanup

### **Database Schema**

```
users ← projects ← tasks
  ↓         ↓        ↓
contacts  members  assignments
```

## **API Architecture**

### **Endpoint Structure**

```
Legacy Endpoints (Backward Compatible):
├── /api/tasks/*          → Task management
├── /api/users/*          → User management  
├── /api/projects/*       → Project management
├── /api/auth/*           → Authentication
└── /api/analytics/*      → Analytics

Modular Endpoints (New Architecture):
├── /api/modules          → List all modules
├── /api/modules/:name    → Module information
├── /api/modules/:name/health → Module health check
└── /api/modules/:name/debug  → Module debug info
```

### **API Versioning**

- **Current**: v1 (legacy endpoints)
- **Future**: v2 (modular endpoints with enhanced features)

## **Security Architecture**

### **Authentication**

- **JWT Tokens**: Stateless authentication
- **OAuth Integration**: WhatsApp-based verification
- **Role-Based Access Control**: User, Admin, Super Admin roles

### **Authorization**

- **Module-Level Permissions**: Each module defines its access requirements
- **Route-Level Guards**: Express middleware for endpoint protection
- **Service-Level Validation**: Business logic validation in services

## **Deployment Architecture**

### **Railway Deployment**

```
GitHub Repository → Railway Auto-Deploy → Production Environment
     ↓                    ↓                    ↓
  Code Changes    →   Build Process   →   Live Application
```

### **Environment Configuration**

```bash
# Modular Architecture Toggle
ENABLE_MODULAR=true

# Database Configuration
DATABASE_URL=postgresql://...

# Feature Flags
ENABLE_MODULAR_TASKS=true
ENABLE_MODULAR_USERS=true
ENABLE_MODULAR_PROJECTS=true
```

## **Monitoring & Observability**

### **Health Checks**

- **System Health**: `/health` - Overall system status
- **Module Health**: `/api/modules/:name/health` - Individual module status
- **Service Health**: Service-level health checks in ServiceContainer

### **Logging**

- **Winston Logger**: Structured logging with multiple transports
- **Module Logging**: Each module has its own logger instance
- **Request Logging**: HTTP request/response logging middleware

### **Metrics**

- **Module Performance**: Response times, error rates
- **Resource Usage**: Database connections, memory usage
- **Business Metrics**: Task completion rates, user activity

## **Scalability Patterns**

### **Horizontal Scaling**

- **Stateless Design**: No session state stored in memory
- **Database Connection Pooling**: Efficient database resource management
- **Event-Driven Architecture**: Loose coupling for independent scaling

### **Vertical Scaling**

- **Module Isolation**: Modules can be optimized independently
- **Service Container**: Dependency injection for flexible service management
- **Async Processing**: Non-blocking I/O operations

## **Development Workflow**

### **Module Development**

1. **Create Module Structure**:
   ```
   modules/new-feature/
   ├── index.js          # Module interface
   ├── services/         # Business logic
   ├── routes/           # API endpoints
   └── models/           # Data models
   ```

2. **Implement Interface**: Follow module contract
3. **Add Dependencies**: Register required services
4. **Test Locally**: Use `npm run start:modular`
5. **Deploy**: Push to GitHub for Railway auto-deploy

### **Testing Strategy**

- **Unit Tests**: Individual module testing
- **Integration Tests**: Module interaction testing
- **E2E Tests**: Full system workflow testing
- **Health Checks**: Automated health monitoring

## **Migration Strategy**

### **Phase 1** ✅ **COMPLETED**
- Core infrastructure (ServiceContainer, EventBus, ModuleInterface)
- Database connection management
- Module loader and discovery

### **Phase 2** ✅ **COMPLETED**
- Tasks module migration
- Hybrid architecture integration
- Production deployment support

### **Phase 3** ✅ **COMPLETED**
- Users, Projects, and Auth modules migrated
- Stub modules for future features
- Event-driven communication patterns

### **Phase 4** 🔄 **IN PROGRESS**
- Frontend modular structure
- Module management UI
- Enhanced monitoring and metrics

### **Phase 5** ⏳ **PLANNED**
- Advanced event system
- Plugin architecture
- Performance optimization

## **Best Practices**

### **Module Design**

- **Single Responsibility**: Each module has one clear purpose
- **Dependency Injection**: Use ServiceContainer for dependencies
- **Event-Driven**: Communicate via EventBus, not direct imports
- **Health Monitoring**: Implement comprehensive health checks

### **Code Organization**

- **Consistent Structure**: Follow established module patterns
- **Clear Interfaces**: Well-defined module contracts
- **Error Handling**: Comprehensive error handling and logging
- **Documentation**: Clear documentation for each module

### **Performance**

- **Connection Pooling**: Reuse database connections
- **Async Operations**: Use async/await for I/O operations
- **Event Batching**: Batch events when possible
- **Resource Cleanup**: Proper cleanup in shutdown hooks

## **Troubleshooting**

### **Common Issues**

1. **Module Not Found**: Check module discovery in ModuleLoader
2. **Service Not Found**: Verify service registration in ServiceContainer
3. **Database Connection**: Check fallback database configuration
4. **Health Check Failures**: Review module health implementation

### **Debug Commands**

```bash
# Check module status
curl https://vitan-task-production.up.railway.app/api/modules

# Check specific module health
curl https://vitan-task-production.up.railway.app/api/modules/tasks/health

# Check system health
curl https://vitan-task-production.up.railway.app/health
```

## **Future Roadmap**

### **Short Term (1-3 months)**
- Complete frontend modularization
- Enhanced module management UI
- Performance monitoring dashboard

### **Medium Term (3-6 months)**
- Plugin system for third-party modules
- Advanced event routing and filtering
- Machine learning integration

### **Long Term (6+ months)**
- Microservices architecture
- Kubernetes deployment
- Global distribution

---

**Last Updated**: August 16, 2024  
**Version**: 2.0.0  
**Architecture Status**: Phase 3 Complete, Phase 4 In Progress
