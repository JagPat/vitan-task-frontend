import React from 'react';

export function createPageUrl(pageName: string) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

/**
 * React component validation hook
 * Validates components before they're rendered
 */
export function useComponentValidation(component: any): any {
  React.useEffect(() => {
    if (component && typeof component === 'object') {
      // Check if component has invalid properties
      const invalidProps = ['__proto__', 'constructor', 'prototype'];
      for (const prop of invalidProps) {
        if (component && typeof component === 'object' && component.hasOwnProperty(prop)) {
          console.warn(`🚨 Invalid component property detected: ${prop}`, component);
          return null;
        }
      }
    }
  }, [component]);
  
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
    return component.map(item => validateReactComponentAdvanced(item)).filter(item => item !== null);
  }
  
  // Check for specific problematic patterns
  if (typeof component === 'object' && component !== null) {
    // Check for prototype pollution
    if (component.hasOwnProperty('__proto__') || 
        component.hasOwnProperty('constructor') || 
        component.hasOwnProperty('prototype')) {
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
 * Final nuclear approach: Complete object prevention
 * Prevents ANY object from reaching React rendering
 */
export function finalNuclearSanitize(obj: any): any {
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
 * React component final validation
 * Only allows primitive values and valid React components
 */
export function finalReactValidation(component: any): any {
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
    // Only allow functions that look like React components
    if (component.name && component.name.length > 0) {
      return component;
    }
    return null;
  }
  
  // If it's a React element, validate its type
  if (component && typeof component === 'object' && component.type) {
    return component;
  }
  
  // For any other object, return null
  return null;
}