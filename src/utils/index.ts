export function createPageUrl(pageName: string) {
  return `/${pageName.toLowerCase().replace(/\s+/g, '')}`;
}

/**
 * Extract primitive values from API responses to prevent React error #130
 * This function ensures only primitive values are stored in React state
 */
export function extractPrimitives(data: any, seen = new WeakSet()): any {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  // Prevent circular references
  if (typeof data === 'object') {
    if (seen.has(data)) {
      return null; // Return null for circular references
    }
    seen.add(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => extractPrimitives(item, seen)).filter(item => item !== null);
  }
  
  if (typeof data === 'object') {
    const cleanObject: any = {};
    for (const [key, value] of Object.entries(data)) {
      const primitiveValue = extractPrimitives(value, seen);
      if (primitiveValue !== null) {
        cleanObject[key] = primitiveValue;
      }
    }
    return cleanObject;
  }
  
  return null;
}

/**
 * Extract primitive values from task objects
 */
export function extractTaskPrimitives(task: any): any {
  if (!task || typeof task !== 'object') {
    return null;
  }
  
  return {
    id: typeof task.id === 'number' ? task.id : null,
    title: typeof task.title === 'string' ? task.title : null,
    description: typeof task.description === 'string' ? task.description : null,
    status: typeof task.status === 'string' ? task.status : null,
    priority: typeof task.priority === 'string' ? task.priority : null,
    due_date: typeof task.due_date === 'string' ? task.due_date : null,
    created_at: typeof task.created_at === 'string' ? task.created_at : null,
    updated_at: typeof task.updated_at === 'string' ? task.updated_at : null,
    assigned_to: typeof task.assigned_to === 'number' ? task.assigned_to : null,
    assigned_to_name: typeof task.assigned_to_name === 'string' ? task.assigned_to_name : null,
    assigned_to_whatsapp: typeof task.assigned_to_whatsapp === 'string' ? task.assigned_to_whatsapp : null,
    project_id: typeof task.project_id === 'number' ? task.project_id : null,
    created_by: typeof task.created_by === 'number' ? task.created_by : null,
    created_by_name: typeof task.created_by_name === 'string' ? task.created_by_name : null,
    created_by_whatsapp: typeof task.created_by_whatsapp === 'string' ? task.created_by_whatsapp : null,
    milestone: typeof task.milestone === 'string' ? task.milestone : null,
    deleted_at: typeof task.deleted_at === 'string' ? task.deleted_at : null,
    deleted_by: typeof task.deleted_by === 'number' ? task.deleted_by : null,
    tags: Array.isArray(task.tags) ? task.tags.filter(tag => typeof tag === 'string') : [],
    estimated_hours: typeof task.estimated_hours === 'number' ? task.estimated_hours : null,
    actual_hours: typeof task.actual_hours === 'number' ? task.actual_hours : null,
  };
}

/**
 * Extract primitive values from user objects
 */
export function extractUserPrimitives(user: any): any {
  if (!user || typeof user !== 'object') {
    return null;
  }
  
  return {
    id: typeof user.id === 'number' ? user.id : null,
    full_name: typeof user.full_name === 'string' ? user.full_name : null,
    email: typeof user.email === 'string' ? user.email : null,
    role: typeof user.role === 'string' ? user.role : null,
    whatsapp_number: typeof user.whatsapp_number === 'string' ? user.whatsapp_number : null,
    company: typeof user.company === 'string' ? user.company : null,
    location: typeof user.location === 'string' ? user.location : null,
    verified: typeof user.verified === 'boolean' ? user.verified : false,
    created_at: typeof user.created_at === 'string' ? user.created_at : null,
    updated_at: typeof user.updated_at === 'string' ? user.updated_at : null,
  };
}

/**
 * Extract primitive values from project objects
 */
export function extractProjectPrimitives(project: any): any {
  if (!project || typeof project !== 'object') {
    return null;
  }
  
  return {
    id: typeof project.id === 'number' ? project.id : null,
    name: typeof project.name === 'string' ? project.name : null,
    description: typeof project.description === 'string' ? project.description : null,
    status: typeof project.status === 'string' ? project.status : null,
    created_at: typeof project.created_at === 'string' ? project.created_at : null,
    updated_at: typeof project.updated_at === 'string' ? project.updated_at : null,
    created_by: typeof project.created_by === 'string' ? project.created_by : null,
    category: typeof project.category === 'string' ? project.category : null,
  };
}

/**
 * Extract primitive values from activity log objects
 */
export function extractActivityPrimitives(activity: any): any {
  if (!activity || typeof activity !== 'object') {
    return null;
  }
  
  return {
    id: typeof activity.id === 'number' ? activity.id : null,
    action: typeof activity.action === 'string' ? activity.action : null,
    description: typeof activity.description === 'string' ? activity.description : null,
    created_at: typeof activity.created_at === 'string' ? activity.created_at : null,
    updated_at: typeof activity.updated_at === 'string' ? activity.updated_at : null,
    user_id: typeof activity.user_id === 'number' ? activity.user_id : null,
    task_id: typeof activity.task_id === 'number' ? activity.task_id : null,
    project_id: typeof activity.project_id === 'number' ? activity.project_id : null,
  };
}
/**
 * React component validation utility
 * Validates components before they're rendered
 */
export function validateComponent(component: any): any {
  if (component && typeof component === 'object') {
    // Check if component has invalid properties
    const invalidProps = ['__proto__', 'constructor', 'prototype'];
    for (const prop of invalidProps) {
      if (
        component &&
        typeof component === 'object' &&
        Object.prototype.hasOwnProperty.call(component, prop)
      ) {
        console.warn(`🚨 Invalid component property detected: ${prop}`, component);
        return null;
      }
    }
  }
  
  return component;
}

/**
 * Advanced React component validation
 * Checks for specific problematic patterns that cause React error #130
 */
export function validateReactComponentAdvanced(component: any): any {
  // If it's null, undefined, return null
  if (component === null || component === undefined) {
    return null;
  }
  
  // If it's a valid React component (function or class), return as is
  if (typeof component === 'function') {
    // Check if it's a valid function component
    try {
      // Test if the function can be called safely
      if (component.name && component.name.length > 0) {
        return component;
      }
      return component;
    } catch (error) {
      console.warn('Invalid function component detected:', component);
      return null;
    }
  }
  
  // If it's a React element (has type property), return as is
  if (component && typeof component === 'object' && component.type) {
    return component;
  }
  
  // If it's a plain object, string, number, or boolean, it's safe
  if (typeof component === 'string' || typeof component === 'number' || typeof component === 'boolean') {
    return component;
  }
  
  // If it's an array, validate each item
  if (Array.isArray(component)) {
    return component
      .map(item => validateReactComponentAdvanced(item))
      .filter(item => item !== null);

  }
  // Use Object.prototype.hasOwnProperty.call to avoid TS error and ensure compatibility
  if (component && typeof component === 'object') {
    // Check for prototype pollution
    if (
      Object.prototype.hasOwnProperty.call(component, '__proto__') ||
      Object.prototype.hasOwnProperty.call(component, 'constructor') ||
      Object.prototype.hasOwnProperty.call(component, 'prototype')
    ) {
      console.warn('Component with prototype pollution detected:', component);
      return null;
    }
    // Check if it's a plain object (safe)
    if (component.constructor === Object) {
      return component;
    }
  }
  
  // For any other object, return null to prevent rendering
  return null;
}

/**
 * Nuclear sanitize object for React rendering to prevent error #130
 * Completely eliminates any object that could cause serialization issues
 */
export function nuclearSanitizeForReact(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  // Nuclear approach: If it's any kind of object, only keep primitive properties
  if (typeof obj === 'object') {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Only keep primitive values
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
        sanitized[key] = value;
      }
      // Skip everything else (functions, objects, arrays, etc.)
    }
    
    return sanitized;
  }
  
  return null;
}

/**
 * Ultra-aggressive sanitize object for React rendering to prevent error #130
 * Specifically handles Object and Function prototypes that cause serialization issues
 */
export function ultraSanitizeForReact(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  // Handle Object and Function prototypes specifically
  if (obj === Object.prototype || obj === Function.prototype || 
      obj.constructor === Object || obj.constructor === Function) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => ultraSanitizeForReact(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    const seen = new WeakSet();
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions, undefined, and complex objects that might cause issues
      if (typeof value === 'function' || value === undefined) {
        continue;
      }
      
      // Skip Date objects, RegExp, Error, and prototype objects
      if (value instanceof Date || value instanceof RegExp || value instanceof Error ||
          value === Object.prototype || value === Function.prototype ||
          (typeof value === 'object' && value !== null && 
           (value.constructor === Object || value.constructor === Function))) {
        continue;
      }
      
      // Skip circular references
      if (seen.has(value as object)) {
        continue;
      }
      
      // Skip objects that might contain circular references
      if (typeof value === 'object' && value !== null) {
        seen.add(value as object);
      }
      
      const sanitizedValue = ultraSanitizeForReact(value);
      if (sanitizedValue !== null) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }
  
  return null;
}

/**
 * Enhanced sanitize object for React rendering to prevent error #130
 * More aggressive removal of non-serializable properties
 */
export function sanitizeForReact(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForReact(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    const seen = new WeakSet();
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions, undefined, and complex objects that might cause issues
      if (typeof value === 'function' || value === undefined) {
        continue;
      }
      
      // Skip Date objects, RegExp, and other complex objects
      if (value instanceof Date || value instanceof RegExp || value instanceof Error) {
        continue;
      }
      
      // Skip circular references
      if (seen.has(value as object)) {
        continue;
      }
      
      // Skip objects that might contain circular references
      if (typeof value === 'object' && value !== null) {
        seen.add(value as object);
      }
      
      const sanitizedValue = sanitizeForReact(value);
      if (sanitizedValue !== null) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }
  
  return null;
}

/**
 * Deep clone and sanitize object for React
 */
export function deepSanitizeForReact(obj: any): any {
  try {
    // First, try to JSON stringify/parse to remove any non-serializable content
    const jsonString = JSON.stringify(obj);
    const parsed = JSON.parse(jsonString);
    return nuclearSanitizeForReact(parsed);
  } catch (error) {
    console.warn('Error in deep sanitization, falling back to nuclear sanitization:', error);
    return nuclearSanitizeForReact(obj);
  }
}

/**
 * Safe object access with fallback
 */
export function safeGet(obj: any, path: string, fallback: any = null): any {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
  } catch (error) {
    console.warn('Error accessing object path:', path, error);
    return fallback;
  }
}

/**
 * Comprehensive nuclear approach: Complete prevention of any non-primitive data
 * This is the most aggressive possible approach to prevent React error #130
 */
export function comprehensiveNuclearSanitize(obj: any): any {
  // Only allow primitives and null
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  // For ANY object or array, return null
  return null;
}

/**
 * React component comprehensive validation
 * Only allows primitive values and valid React components
 */
export function comprehensiveReactValidation(component: any): any {
  // If it's null, undefined, return null
  if (component === null || component === undefined) {
    return null;
  }
  
  // If it's a primitive, it's safe
  if (typeof component === 'string' || typeof component === 'number' || typeof component === 'boolean') {
    return component;
  }
  
  // If it's a function, check if it's a valid React component
  if (typeof component === 'function') {
    return component;
  }

  // If it's an array, validate each element
  if (Array.isArray(component)) {
    return component.map(item => comprehensiveReactValidation(item));
  }
  
  // If it's a React element, validate its type
  if (component && typeof component === 'object' && component.type) {
    return component;
  }
  
  // Allow React Context components (they have $$typeof property)
  if (component && typeof component === 'object' && component.$$typeof) {
    return component;
  }
  
  // Allow React Fragment (Symbol.for('react.fragment'))
  if (component && typeof component === 'symbol' && component.toString() === 'Symbol(react.fragment)') {
    return component;
  }
  
  // For any other object, return null to prevent rendering
  return null;
}

/**
 * Global React error prevention
 * Prevents any object from reaching React rendering
 */
export function preventReactError130(obj: any): any {
  // Nuclear approach: Only primitives allowed
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  // For ANY object or array, return null
  return null;
}