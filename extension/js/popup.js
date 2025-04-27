/**
 * Popup Script for GhostTyper
 * 
 * This script handles the popup UI when clicking the extension icon.
 */

// DOM elements
const enableToggle = document.getElementById('enableToggle');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const apiKeyIndicator = document.querySelector('.api-key-indicator');
const apiKeyText = document.querySelector('.api-key-text');

// Initialize the popup
async function initialize() {
  // Get settings from storage
  const settings = await chrome.storage.local.get(['isEnabled', 'apiKey']);
  
  // Set toggle state
  enableToggle.checked = settings.isEnabled;
  
  // Update status indicator
  updateStatusIndicator(settings.isEnabled);
  
  // Update API key indicator
  updateApiKeyIndicator(settings.apiKey);
  
  // Add event listener for toggle
  enableToggle.addEventListener('change', handleToggleChange);
}

/**
 * Update the status indicator
 * 
 * @param {boolean} isEnabled - Whether the extension is enabled
 */
function updateStatusIndicator(isEnabled) {
  if (isEnabled) {
    statusDot.classList.add('active');
    statusDot.classList.remove('inactive');
    statusText.textContent = 'Active';
  } else {
    statusDot.classList.add('inactive');
    statusDot.classList.remove('active');
    statusText.textContent = 'Inactive';
  }
}

/**
 * Update the API key indicator
 * 
 * @param {string} apiKey - The API key
 */
function updateApiKeyIndicator(apiKey) {
  if (apiKey) {
    apiKeyIndicator.classList.add('set');
    apiKeyIndicator.classList.remove('not-set');
    apiKeyText.textContent = 'API Key: Set';
  } else {
    apiKeyIndicator.classList.add('not-set');
    apiKeyIndicator.classList.remove('set');
    apiKeyText.textContent = 'API Key: Not Set';
  }
}

/**
 * Handle toggle change event
 * 
 * @param {Event} event - The change event
 */
async function handleToggleChange(event) {
  const isEnabled = event.target.checked;
  
  // Update storage
  await chrome.storage.local.set({ isEnabled });
  
  // Update status indicator
  updateStatusIndicator(isEnabled);
}

// Initialize the popup
initialize();
