


export function createPageUrl(pageName: string) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

/**
 * Sanitize object for React rendering to prevent error #130
 * Removes non-serializable properties like functions, undefined values, etc.
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
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions and undefined values
      if (typeof value === 'function' || value === undefined) {
        continue;
      }
      
      // Skip circular references by checking if value is the same as obj
      if (value === obj) {
        continue;
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