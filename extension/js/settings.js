/**
 * GhostTyper - Settings Script
 * Handles the settings page UI and interactions
 */

// DOM elements
const apiKeyInput = document.getElementById('apiKeyInput');
const showApiKeyButton = document.getElementById('showApiKeyButton');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const blacklistInput = document.getElementById('blacklistInput');
const delaySlider = document.getElementById('delaySlider');
const delayValue = document.getElementById('delayValue');
const saveButton = document.getElementById('saveButton');
const backButton = document.getElementById('backButton');

// Initialize the settings page
document.addEventListener('DOMContentLoaded', initialize);

/**
 * Initializes the settings page
 */
function initialize() {
  // Get settings from background script
  chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
    // Update the UI based on the settings
    updateUI(settings);
  });
  
  // Add event listeners
  showApiKeyButton.addEventListener('click', toggleApiKeyVisibility);
  delaySlider.addEventListener('input', updateDelayValue);
  saveButton.addEventListener('click', saveSettings);
  backButton.addEventListener('click', goBack);
}

/**
 * Updates the UI based on the settings
 * @param {Object} settings - The extension settings
 */
function updateUI(settings) {
  // Update the API key input
  apiKeyInput.value = settings.geminiApiKey || '';
  
  // Update the blacklist input
  blacklistInput.value = settings.blacklist.join('\n');
  
  // Update the delay slider
  delaySlider.value = settings.suggestionDelay;
  updateDelayValue();
}

/**
 * Toggles the visibility of the API key
 */
function toggleApiKeyVisibility() {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    showApiKeyButton.textContent = '🔒';
  } else {
    apiKeyInput.type = 'password';
    showApiKeyButton.textContent = '👁️';
  }
}

/**
 * Updates the delay value display
 */
function updateDelayValue() {
  delayValue.textContent = `${delaySlider.value}ms`;
}

/**
 * Saves the settings
 */
async function saveSettings() {
  // Disable the save button while saving
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';
  
  // Get the values from the inputs
  const apiKey = apiKeyInput.value.trim();
  const blacklist = blacklistInput.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  const suggestionDelay = parseInt(delaySlider.value, 10);
  
  // Validate the API key if it's changed
  if (apiKey) {
    apiKeyStatus.textContent = 'Validating API key...';
    apiKeyStatus.className = 'status-message';
    
    try {
      const response = await new Promise(resolve => {
        chrome.runtime.sendMessage({ action: 'validateApiKey', apiKey }, resolve);
      });
      
      if (!response.isValid) {
        apiKeyStatus.textContent = response.error || 'Invalid API key';
        apiKeyStatus.className = 'status-message error';
        
        // Re-enable the save button
        saveButton.disabled = false;
        saveButton.textContent = 'Save Settings';
        
        return;
      }
      
      apiKeyStatus.textContent = 'API key is valid';
      apiKeyStatus.className = 'status-message success';
    } catch (error) {
      apiKeyStatus.textContent = error.message || 'Error validating API key';
      apiKeyStatus.className = 'status-message error';
      
      // Re-enable the save button
      saveButton.disabled = false;
      saveButton.textContent = 'Save Settings';
      
      return;
    }
  }
  
  // Save the settings
  chrome.storage.sync.set(
    { 
      geminiApiKey: apiKey,
      blacklist,
      suggestionDelay
    },
    () => {
      // Show a success message
      apiKeyStatus.textContent = 'Settings saved successfully';
      apiKeyStatus.className = 'status-message success';
      
      // Re-enable the save button
      saveButton.disabled = false;
      saveButton.textContent = 'Save Settings';
      
      // Go back to the popup after a short delay
      setTimeout(goBack, 1500);
    }
  );
}

/**
 * Goes back to the popup
 */
function goBack() {
  window.close();
}
