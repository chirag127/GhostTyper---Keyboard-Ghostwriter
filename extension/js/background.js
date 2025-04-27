/**
 * Background Service Worker for GhostTyper
 * 
 * This script handles communication between content scripts and the backend,
 * manages extension state, and processes API requests.
 */

// Default backend URL
const DEFAULT_BACKEND_URL = 'http://localhost:3000';

// Default settings
const DEFAULT_SETTINGS = {
  isEnabled: true,
  apiKey: '',
  siteList: [],
  triggerDelay: 500,
  presentationMode: 'inline'
};

// Initialize extension state
chrome.runtime.onInstalled.addListener(async () => {
  // Set default settings if not already set
  const settings = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const newSettings = { ...DEFAULT_SETTINGS, ...settings };
  await chrome.storage.local.set(newSettings);
  
  // Set badge based on enabled state
  updateBadge(newSettings.isEnabled);
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    // Get settings and send back to content script
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (settings) => {
      sendResponse({ settings: { ...DEFAULT_SETTINGS, ...settings } });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'GENERATE_SUGGESTION') {
    // Generate suggestion using the backend
    generateSuggestion(message.context)
      .then(suggestion => {
        sendResponse({ success: true, suggestion });
      })
      .catch(error => {
        console.error('Error generating suggestion:', error);
        sendResponse({ success: false, error: error.message });
        
        // Update badge to show error
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
        
        // Reset badge after 5 seconds
        setTimeout(() => {
          chrome.storage.local.get('isEnabled', ({ isEnabled }) => {
            updateBadge(isEnabled);
          });
        }, 5000);
      });
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'RECORD_TELEMETRY') {
    // Record telemetry data
    recordTelemetry(message.data)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error recording telemetry:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

// Listen for changes to storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.isEnabled) {
    // Update badge when enabled state changes
    updateBadge(changes.isEnabled.newValue);
  }
});

/**
 * Update the extension badge based on enabled state
 * 
 * @param {boolean} isEnabled - Whether the extension is enabled
 */
function updateBadge(isEnabled) {
  if (isEnabled) {
    chrome.action.setBadgeText({ text: '' });
  } else {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#9E9E9E' });
  }
}

/**
 * Generate a suggestion using the backend
 * 
 * @param {string} context - The text context to generate a suggestion from
 * @returns {Promise<string>} - The generated suggestion
 */
async function generateSuggestion(context) {
  try {
    // Get API key from storage
    const { apiKey } = await chrome.storage.local.get('apiKey');
    
    if (!apiKey) {
      throw new Error('API key not set. Please set your Gemini API key in the extension settings.');
    }
    
    // Get backend URL from storage or use default
    const { backendUrl = DEFAULT_BACKEND_URL } = await chrome.storage.local.get('backendUrl');
    
    // Make request to backend
    const response = await fetch(`${backendUrl}/api/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ context, apiKey })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    // Read the response text
    const suggestion = await response.text();
    return suggestion;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw error;
  }
}

/**
 * Record telemetry data
 * 
 * @param {Object} data - The telemetry data to record
 * @returns {Promise<void>}
 */
async function recordTelemetry(data) {
  try {
    // Get backend URL from storage or use default
    const { backendUrl = DEFAULT_BACKEND_URL } = await chrome.storage.local.get('backendUrl');
    
    // Make request to backend
    const response = await fetch(`${backendUrl}/api/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error recording telemetry:', error);
    throw error;
  }
}
