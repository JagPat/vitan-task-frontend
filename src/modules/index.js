// Main Modules Index - Frontend
// This file provides access to all modules and module management functionality

// Import all modules
import * as tasksModule from './tasks';
import * as usersModule from './users';
import * as projectsModule from './projects';
import * as authModule from './auth';
import * as whatsappModule from './whatsapp';
import * as analyticsModule from './analytics';
import * as aiModule from './ai';
import * as contactsModule from './contacts';

// Module registry
export const modules = {
  tasks: tasksModule,
  users: usersModule,
  projects: projectsModule,
  auth: authModule,
  whatsapp: whatsappModule,
  analytics: analyticsModule,
  ai: aiModule,
  contacts: contactsModule
};

// Get module information
export const getModuleInfo = (moduleName) => {
  const module = modules[moduleName];
  return module?.moduleInfo || null;
};

// Get all module information
export const getAllModuleInfo = () => {
  return Object.entries(modules).map(([name, module]) => ({
    name,
    ...module.moduleInfo
  }));
};

// Check module dependencies
export const checkModuleDependencies = (moduleName) => {
  const module = modules[moduleName];
  if (!module) return { available: false, missing: [] };

  const dependencies = module.moduleInfo?.dependencies || [];
  const missing = dependencies.filter(dep => !modules[dep]);

  return {
    available: missing.length === 0,
    missing,
    dependencies
  };
};

// Get module routes
export const getModuleRoutes = (moduleName) => {
  const module = modules[moduleName];
  return module?.moduleInfo?.routes || [];
};

// Get all available routes
export const getAllRoutes = () => {
  const allRoutes = [];
  Object.values(modules).forEach(module => {
    if (module.moduleInfo?.routes) {
      allRoutes.push(...module.moduleInfo.routes);
    }
  });
  return allRoutes;
};

// Module health check
export const checkModuleHealth = async (moduleName) => {
  try {
    const response = await fetch(`https://vitan-task-production.up.railway.app/api/modules/${moduleName}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      module: moduleName
    };
  }
};

// Check all modules health
export const checkAllModulesHealth = async () => {
  const healthChecks = await Promise.allSettled(
    Object.keys(modules).map(moduleName => checkModuleHealth(moduleName))
  );

  const results = {};
  Object.keys(modules).forEach((moduleName, index) => {
    const result = healthChecks[index];
    if (result.status === 'fulfilled') {
      results[moduleName] = result.value;
    } else {
      results[moduleName] = {
        status: 'error',
        error: result.reason?.message || 'Unknown error',
        module: moduleName
      };
    }
  });

  return results;
};

// Module loader
export const loadModule = async (moduleName) => {
  try {
    const module = modules[moduleName];
    if (!module) {
      throw new Error(`Module '${moduleName}' not found`);
    }

    // Check dependencies
    const depCheck = checkModuleDependencies(moduleName);
    if (!depCheck.available) {
      throw new Error(`Module '${moduleName}' has missing dependencies: ${depCheck.missing.join(', ')}`);
    }

    // Check health
    const health = await checkModuleHealth(moduleName);
    if (health.status === 'error') {
      throw new Error(`Module '${moduleName}' health check failed: ${health.error}`);
    }

    return {
      module,
      health,
      dependencies: depCheck.dependencies
    };
  } catch (error) {
    throw new Error(`Failed to load module '${moduleName}': ${error.message}`);
  }
};

// Module unloader
export const unloadModule = (moduleName) => {
  // TODO: Implement module unloading logic
  console.log(`Unloading module: ${moduleName}`);
  return true;
};

// Module status
export const getModuleStatus = (moduleName) => {
  const module = modules[moduleName];
  if (!module) return 'not-found';

  // Check if module is loaded
  if (module.moduleInfo) {
    return 'loaded';
  }

  return 'unknown';
};

// Get all module statuses
export const getAllModuleStatuses = () => {
  const statuses = {};
  Object.keys(modules).forEach(moduleName => {
    statuses[moduleName] = getModuleStatus(moduleName);
  });
  return statuses;
};

// Export individual modules
export { default as ModuleManager } from '../components/ModuleManager';

// Export module utilities
export const moduleUtils = {
  getModuleInfo,
  getAllModuleInfo,
  checkModuleDependencies,
  getModuleRoutes,
  getAllRoutes,
  checkModuleHealth,
  checkAllModulesHealth,
  loadModule,
  unloadModule,
  getModuleStatus,
  getAllModuleStatuses
};

// Default export
export default {
  modules,
  moduleUtils,
  ModuleManager
};
