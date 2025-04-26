/**
 * GhostTyper - Utility Functions
 * Common utility functions used across the extension
 */

/**
 * Debounces a function to limit how often it can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Extracts the hostname from a URL
 * @param {string} url - The URL to extract the hostname from
 * @returns {string} - The hostname
 */
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return '';
  }
}

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} html - The HTML to sanitize
 * @returns {string} - The sanitized HTML
 */
function sanitizeHtml(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Logs a message to the console with the extension name
 * @param {...any} args - The arguments to log
 */
function log(...args) {
  console.log('[GhostTyper]', ...args);
}

/**
 * Logs an error to the console with the extension name
 * @param {...any} args - The arguments to log
 */
function logError(...args) {
  console.error('[GhostTyper]', ...args);
}
