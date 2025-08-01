


export function createPageUrl(pageName: string) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
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
      if (seen.has(value)) {
        continue;
      }
      
      // Skip objects that might contain circular references
      if (typeof value === 'object' && value !== null) {
        seen.add(value);
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
      if (seen.has(value)) {
        continue;
      }
      
      // Skip objects that might contain circular references
      if (typeof value === 'object' && value !== null) {
        seen.add(value);
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
    return ultraSanitizeForReact(parsed);
  } catch (error) {
    console.warn('Error in deep sanitization, falling back to ultra sanitization:', error);
    return ultraSanitizeForReact(obj);
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