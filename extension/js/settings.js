/**
 * Settings Script for GhostTyper
 * 
 * This script handles the settings page functionality.
 */

// Import utility functions
import { storage } from './utils.js';

// DOM elements
const settingsForm = document.getElementById('settingsForm');
const isEnabledToggle = document.getElementById('isEnabled');
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');
const triggerDelayInput = document.getElementById('triggerDelay');
const triggerDelayValue = document.getElementById('triggerDelayValue');
const presentationModeRadios = document.getElementsByName('presentationMode');
const siteListTextarea = document.getElementById('siteList');
const backendUrlInput = document.getElementById('backendUrl');
const clearDataBtn = document.getElementById('clearDataBtn');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

// Default settings
const DEFAULT_SETTINGS = {
  isEnabled: true,
  apiKey: '',
  triggerDelay: 500,
  presentationMode: 'inline',
  siteList: [],
  backendUrl: 'http://localhost:3000'
};

// Initialize the settings page
async function initialize() {
  // Load settings from storage
  const settings = await loadSettings();
  
  // Populate form with settings
  populateForm(settings);
  
  // Add event listeners
  addEventListeners();
}

/**
 * Load settings from storage
 * 
 * @returns {Promise<Object>} - The settings
 */
async function loadSettings() {
  try {
    const settings = await storage.get(Object.keys(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Populate the form with settings
 * 
 * @param {Object} settings - The settings to populate
 */
function populateForm(settings) {
  // Set toggle state
  isEnabledToggle.checked = settings.isEnabled;
  
  // Set API key
  apiKeyInput.value = settings.apiKey || '';
  
  // Set trigger delay
  triggerDelayInput.value = settings.triggerDelay;
  triggerDelayValue.textContent = settings.triggerDelay;
  
  // Set presentation mode
  for (const radio of presentationModeRadios) {
    if (radio.value === settings.presentationMode) {
      radio.checked = true;
      break;
    }
  }
  
  // Set site list
  if (Array.isArray(settings.siteList)) {
    siteListTextarea.value = settings.siteList.join('\n');
  } else {
    siteListTextarea.value = '';
  }
  
  // Set backend URL
  backendUrlInput.value = settings.backendUrl || DEFAULT_SETTINGS.backendUrl;
}

/**
 * Add event listeners to form elements
 */
function addEventListeners() {
  // Form submission
  settingsForm.addEventListener('submit', handleFormSubmit);
  
  // Toggle API key visibility
  toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
  
  // Update trigger delay value display
  triggerDelayInput.addEventListener('input', updateTriggerDelayValue);
  
  // Clear data button
  clearDataBtn.addEventListener('click', handleClearData);
}

/**
 * Handle form submission
 * 
 * @param {Event} event - The submit event
 */
async function handleFormSubmit(event) {
  // Prevent form submission
  event.preventDefault();
  
  // Get form values
  const settings = {
    isEnabled: isEnabledToggle.checked,
    apiKey: apiKeyInput.value.trim(),
    triggerDelay: parseInt(triggerDelayInput.value, 10),
    presentationMode: getSelectedPresentationMode(),
    siteList: parseSiteList(siteListTextarea.value),
    backendUrl: backendUrlInput.value.trim() || DEFAULT_SETTINGS.backendUrl
  };
  
  // Validate settings
  if (!validateSettings(settings)) {
    return;
  }
  
  try {
    // Save settings to storage
    await storage.set(settings);
    
    // Show success message
    showSaveStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showSaveStatus('Error saving settings. Please try again.', 'error');
  }
}

/**
 * Toggle API key visibility
 */
function toggleApiKeyVisibility() {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleApiKeyBtn.textContent = 'Hide';
  } else {
    apiKeyInput.type = 'password';
    toggleApiKeyBtn.textContent = 'Show';
  }
}

/**
 * Update trigger delay value display
 */
function updateTriggerDelayValue() {
  triggerDelayValue.textContent = triggerDelayInput.value;
}

/**
 * Get the selected presentation mode
 * 
 * @returns {string} - The selected presentation mode
 */
function getSelectedPresentationMode() {
  for (const radio of presentationModeRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return DEFAULT_SETTINGS.presentationMode;
}

/**
 * Parse the site list from textarea
 * 
 * @param {string} text - The site list text
 * @returns {string[]} - The parsed site list
 */
function parseSiteList(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Validate settings
 * 
 * @param {Object} settings - The settings to validate
 * @returns {boolean} - Whether the settings are valid
 */
function validateSettings(settings) {
  // Validate API key (simple validation)
  if (settings.apiKey && settings.apiKey.length < 10) {
    showSaveStatus('API key appears to be invalid. Please check and try again.', 'error');
    return false;
  }
  
  // Validate backend URL
  try {
    new URL(settings.backendUrl);
  } catch (error) {
    showSaveStatus('Backend URL is invalid. Please enter a valid URL.', 'error');
    return false;
  }
  
  return true;
}

/**
 * Show save status message
 * 
 * @param {string} message - The message to show
 * @param {string} type - The message type ('success' or 'error')
 */
function showSaveStatus(message, type) {
  saveStatus.textContent = message;
  saveStatus.className = `save-status ${type}`;
  
  // Clear the message after 3 seconds
  setTimeout(() => {
    saveStatus.textContent = '';
    saveStatus.className = 'save-status';
  }, 3000);
}

/**
 * Handle clear data button click
 */
async function handleClearData() {
  if (confirm('Are you sure you want to clear all data? This will remove your API key and all settings.')) {
    try {
      // Clear all data from storage
      await storage.remove(Object.keys(DEFAULT_SETTINGS));
      
      // Reset form to defaults
      populateForm(DEFAULT_SETTINGS);
      
      // Show success message
      showSaveStatus('All data cleared successfully!', 'success');
    } catch (error) {
      console.error('Error clearing data:', error);
      showSaveStatus('Error clearing data. Please try again.', 'error');
    }
  }
}

// Initialize the settings page
initialize();
