/**
 * GhostTyper - Popup Script
 * Handles the popup UI and interactions
 */

// DOM elements
const enableToggle = document.getElementById('enableToggle');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const settingsButton = document.getElementById('settingsButton');

// Initialize the popup
document.addEventListener('DOMContentLoaded', initialize);

/**
 * Initializes the popup
 */
function initialize() {
  // Get settings from background script
  chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
    // Update the UI based on the settings
    updateUI(settings);
  });
  
  // Add event listeners
  enableToggle.addEventListener('change', handleToggleChange);
  settingsButton.addEventListener('click', openSettings);
}

/**
 * Updates the UI based on the settings
 * @param {Object} settings - The extension settings
 */
function updateUI(settings) {
  // Update the toggle state
  enableToggle.checked = settings.isGloballyEnabled;
  
  // Update the status indicator
  updateStatusIndicator(settings);
}

/**
 * Updates the status indicator based on the settings
 * @param {Object} settings - The extension settings
 */
function updateStatusIndicator(settings) {
  // Check if the extension is enabled
  if (!settings.isGloballyEnabled) {
    statusIndicator.className = 'status-indicator inactive';
    statusText.textContent = 'GhostTyper is disabled';
    return;
  }
  
  // Check if the API key is set
  if (!settings.geminiApiKey) {
    statusIndicator.className = 'status-indicator error';
    statusText.textContent = 'API key not set';
    return;
  }
  
  // Check if the current site is blacklisted
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }
    
    const currentUrl = new URL(tabs[0].url);
    const hostname = currentUrl.hostname;
    
    // Check if the hostname matches any entry in the blacklist
    const isBlacklisted = settings.blacklist.some(entry => {
      // Remove any protocol and www prefix for comparison
      const cleanEntry = entry.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
      return hostname === cleanEntry || hostname.endsWith('.' + cleanEntry);
    });
    
    if (isBlacklisted) {
      statusIndicator.className = 'status-indicator inactive';
      statusText.textContent = 'Site is blacklisted';
    } else {
      statusIndicator.className = 'status-indicator active';
      statusText.textContent = 'GhostTyper is active';
    }
  });
}

/**
 * Handles changes to the enable toggle
 * @param {Event} event - The change event
 */
function handleToggleChange(event) {
  const isEnabled = event.target.checked;
  
  // Save the new setting
  chrome.storage.sync.set({ isGloballyEnabled: isEnabled }, () => {
    // Update the status indicator
    chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
      settings.isGloballyEnabled = isEnabled;
      updateStatusIndicator(settings);
    });
  });
}

/**
 * Opens the settings page
 */
function openSettings() {
  chrome.runtime.openOptionsPage ? 
    chrome.runtime.openOptionsPage() : 
    window.open(chrome.runtime.getURL('settings.html'));
}
