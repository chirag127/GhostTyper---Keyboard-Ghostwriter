/**
 * Utility functions for the GhostTyper extension
 */

/**
 * Debounce function to limit the rate at which a function is called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
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
 * Check if a URL matches any pattern in a list
 * 
 * @param {string} url - The URL to check
 * @param {string[]} patterns - List of URL patterns
 * @returns {boolean} - True if the URL matches any pattern
 */
function matchesUrlPattern(url, patterns) {
  if (!patterns || !patterns.length) return false;
  
  const hostname = new URL(url).hostname;
  
  return patterns.some(pattern => {
    // Simple wildcard matching
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(hostname);
  });
}

/**
 * Storage wrapper for chrome.storage.local
 */
const storage = {
  /**
   * Get a value from storage
   * 
   * @param {string|string[]} keys - The key(s) to get
   * @returns {Promise<Object>} - The stored values
   */
  get: (keys) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  },
  
  /**
   * Set a value in storage
   * 
   * @param {Object} items - The items to set
   * @returns {Promise<void>}
   */
  set: (items) => {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => {
        resolve();
      });
    });
  },
  
  /**
   * Remove a value from storage
   * 
   * @param {string|string[]} keys - The key(s) to remove
   * @returns {Promise<void>}
   */
  remove: (keys) => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, () => {
        resolve();
      });
    });
  }
};

/**
 * Check if an element is a text input field
 * 
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is a text input field
 */
function isTextInputField(element) {
  // Check if element is null or undefined
  if (!element) return false;
  
  // Check for input elements
  if (element.tagName === 'INPUT') {
    const type = element.type.toLowerCase();
    // Include text-like inputs, exclude password and other sensitive types
    return ['text', 'search', 'email', 'url', 'tel', 'number'].includes(type);
  }
  
  // Check for textarea elements
  if (element.tagName === 'TEXTAREA') {
    return true;
  }
  
  // Check for contenteditable elements
  if (element.isContentEditable) {
    return true;
  }
  
  return false;
}

/**
 * Get the current cursor position in a text field
 * 
 * @param {HTMLElement} element - The text field element
 * @returns {number} - The cursor position
 */
function getCursorPosition(element) {
  if (!element) return 0;
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.selectionStart;
  }
  
  if (element.isContentEditable) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.startOffset;
    }
  }
  
  return 0;
}

/**
 * Set the cursor position in a text field
 * 
 * @param {HTMLElement} element - The text field element
 * @param {number} position - The position to set the cursor to
 */
function setCursorPosition(element, position) {
  if (!element) return;
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.setSelectionRange(position, position);
    return;
  }
  
  if (element.isContentEditable) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find the text node and position within it
    let currentNode = element.firstChild;
    let currentPos = 0;
    
    while (currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const nodeLength = currentNode.length;
        
        if (currentPos + nodeLength >= position) {
          range.setStart(currentNode, position - currentPos);
          range.setEnd(currentNode, position - currentPos);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        
        currentPos += nodeLength;
      }
      
      currentNode = currentNode.nextSibling;
    }
  }
}

/**
 * Get text content from a text field
 * 
 * @param {HTMLElement} element - The text field element
 * @returns {string} - The text content
 */
function getTextContent(element) {
  if (!element) return '';
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.value;
  }
  
  if (element.isContentEditable) {
    return element.textContent;
  }
  
  return '';
}

/**
 * Set text content in a text field
 * 
 * @param {HTMLElement} element - The text field element
 * @param {string} text - The text to set
 */
function setTextContent(element, text) {
  if (!element) return;
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.value = text;
    return;
  }
  
  if (element.isContentEditable) {
    element.textContent = text;
  }
}

/**
 * Insert text at the current cursor position
 * 
 * @param {HTMLElement} element - The text field element
 * @param {string} text - The text to insert
 * @returns {number} - The new cursor position
 */
function insertTextAtCursor(element, text) {
  if (!element) return 0;
  
  const cursorPos = getCursorPosition(element);
  const currentText = getTextContent(element);
  
  const newText = currentText.substring(0, cursorPos) + text + currentText.substring(cursorPos);
  const newCursorPos = cursorPos + text.length;
  
  setTextContent(element, newText);
  setCursorPosition(element, newCursorPos);
  
  return newCursorPos;
}

/**
 * Get the coordinates of the cursor in a text field
 * 
 * @param {HTMLElement} element - The text field element
 * @returns {Object} - The cursor coordinates {top, left}
 */
function getCursorCoordinates(element) {
  if (!element) return { top: 0, left: 0 };
  
  // For input and textarea elements
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    // Create a mirror div to calculate position
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(element);
    
    // Copy styles from the input
    mirror.style.position = 'absolute';
    mirror.style.top = '0';
    mirror.style.left = '0';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.font = style.font;
    mirror.style.padding = style.padding;
    mirror.style.width = style.width;
    mirror.style.lineHeight = style.lineHeight;
    
    // Get text up to cursor
    const cursorPos = getCursorPosition(element);
    const textBeforeCursor = getTextContent(element).substring(0, cursorPos);
    
    // Add a span at the cursor position
    mirror.textContent = textBeforeCursor;
    const span = document.createElement('span');
    span.textContent = '|';
    mirror.appendChild(span);
    
    // Add to document, measure, then remove
    document.body.appendChild(mirror);
    const spanRect = span.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    document.body.removeChild(mirror);
    
    return {
      top: spanRect.top - elementRect.top + element.scrollTop + parseInt(style.lineHeight),
      left: spanRect.left - elementRect.left + element.scrollLeft
    };
  }
  
  // For contenteditable elements
  if (element.isContentEditable) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      return {
        top: rect.bottom - elementRect.top,
        left: rect.left - elementRect.left
      };
    }
  }
  
  return { top: 0, left: 0 };
}

// Export the utility functions
export {
  debounce,
  matchesUrlPattern,
  storage,
  isTextInputField,
  getCursorPosition,
  setCursorPosition,
  getTextContent,
  setTextContent,
  insertTextAtCursor,
  getCursorCoordinates
};
