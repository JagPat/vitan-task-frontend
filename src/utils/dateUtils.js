/**
 * Safe date parsing utility to prevent "Invalid time value" errors
 */

/**
 * Safely parse a date string and return a Date object or null
 * @param {string} dateString - The date string to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return null;
  }
};

/**
 * Safely format a date string with fallback
 * @param {string} dateString - The date string to format
 * @param {string} formatFn - Format function (e.g., toLocaleDateString)
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} - Formatted date or fallback
 */
export const formatDate = (dateString, formatFn = 'toLocaleDateString', fallback = 'Invalid date') => {
  const date = parseDate(dateString);
  if (!date) return fallback;
  
  try {
    if (typeof date[formatFn] === 'function') {
      return date[formatFn]();
    }
    return fallback;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return fallback;
  }
};

/**
 * Check if a date is overdue (before current date)
 * @param {string} dateString - The date string to check
 * @returns {boolean} - True if overdue, false otherwise
 */
export const isOverdue = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return false;
  
  try {
    return date < new Date();
  } catch (error) {
    console.warn('Error checking overdue date:', error);
    return false;
  }
};

/**
 * Safely compare two dates
 * @param {string} dateString1 - First date string
 * @param {string} dateString2 - Second date string
 * @returns {number} - -1, 0, or 1 for comparison
 */
export const compareDates = (dateString1, dateString2) => {
  const date1 = parseDate(dateString1);
  const date2 = parseDate(dateString2);
  
  if (!date1 && !date2) return 0;
  if (!date1) return 1;
  if (!date2) return -1;
  
  try {
    return date1.getTime() - date2.getTime();
  } catch (error) {
    console.warn('Error comparing dates:', error);
    return 0;
  }
}; 