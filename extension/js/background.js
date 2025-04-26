/**
 * GhostTyper - Background Service Worker
 * Handles API calls to Gemini and manages extension state
 */

// Default settings
const DEFAULT_SETTINGS = {
  isGloballyEnabled: true,
  geminiApiKey: '',
  blacklist: [],
  suggestionDelay: 500
};

// Initialize settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['isGloballyEnabled', 'geminiApiKey', 'blacklist', 'suggestionDelay'], (result) => {
    // Set default values for any missing settings
    const settings = {
      isGloballyEnabled: result.isGloballyEnabled !== undefined ? result.isGloballyEnabled : DEFAULT_SETTINGS.isGloballyEnabled,
      geminiApiKey: result.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey,
      blacklist: result.blacklist || DEFAULT_SETTINGS.blacklist,
      suggestionDelay: result.suggestionDelay || DEFAULT_SETTINGS.suggestionDelay
    };
    
    // Save the settings
    chrome.storage.sync.set(settings);
  });
});

/**
 * Handles messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle different message types
  switch (request.action) {
    case 'getSettings':
      handleGetSettings(sendResponse);
      return true; // Keep the message channel open for async response
      
    case 'getSuggestion':
      handleGetSuggestion(request.text, sendResponse);
      return true; // Keep the message channel open for async response
      
    case 'validateApiKey':
      handleValidateApiKey(request.apiKey, sendResponse);
      return true; // Keep the message channel open for async response
  }
});

/**
 * Retrieves settings from storage and sends them to the requester
 * @param {function} sendResponse - Function to send response back
 */
function handleGetSettings(sendResponse) {
  chrome.storage.sync.get(['isGloballyEnabled', 'geminiApiKey', 'blacklist', 'suggestionDelay'], (result) => {
    sendResponse({
      isGloballyEnabled: result.isGloballyEnabled !== undefined ? result.isGloballyEnabled : DEFAULT_SETTINGS.isGloballyEnabled,
      geminiApiKey: result.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey,
      blacklist: result.blacklist || DEFAULT_SETTINGS.blacklist,
      suggestionDelay: result.suggestionDelay || DEFAULT_SETTINGS.suggestionDelay
    });
  });
}

/**
 * Validates an API key by making a test request to the Gemini API
 * @param {string} apiKey - The API key to validate
 * @param {function} sendResponse - Function to send response back
 */
async function handleValidateApiKey(apiKey, sendResponse) {
  if (!apiKey) {
    sendResponse({ isValid: false, error: 'API key is required' });
    return;
  }
  
  try {
    // Make a simple request to the Gemini API to check if the key is valid
    const model = 'gemini-1.5-flash-latest';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello' }]
      }],
      generationConfig: {
        maxOutputTokens: 1
      }
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      sendResponse({ isValid: false, error: errorData.error?.message || 'Invalid API key' });
      return;
    }
    
    sendResponse({ isValid: true });
  } catch (error) {
    sendResponse({ isValid: false, error: error.message || 'Error validating API key' });
  }
}

/**
 * Gets a suggestion from the Gemini API based on the provided text
 * @param {string} text - The text to generate a suggestion for
 * @param {function} sendResponse - Function to send response back
 */
async function handleGetSuggestion(text, sendResponse) {
  try {
    // Get the API key from storage
    const { geminiApiKey } = await new Promise(resolve => {
      chrome.storage.sync.get(['geminiApiKey'], resolve);
    });
    
    if (!geminiApiKey) {
      sendResponse({ success: false, error: 'API key not set' });
      return;
    }
    
    // Prepare the prompt for the Gemini API
    const prompt = `Continue the following text with a brief, natural completion (1-10 words):\n\n${text}`;
    
    // Make the API request
    const model = 'gemini-1.5-flash-latest';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
    
    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.4,
        topP: 0.8,
        topK: 40
      }
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      sendResponse({ 
        success: false, 
        error: errorData.error?.message || 'Error getting suggestion' 
      });
      return;
    }
    
    const data = await response.json();
    
    // Check if we have a valid response with content
    if (data.candidates && 
        data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      
      // Check for safety blocks
      if (data.candidates[0].finishReason === 'SAFETY') {
        sendResponse({ success: false, error: 'Suggestion blocked due to safety settings' });
        return;
      }
      
      // Get the suggestion text and clean it up
      let suggestion = data.candidates[0].content.parts[0].text.trim();
      
      // Remove the original text if it's included in the response
      if (suggestion.startsWith(text)) {
        suggestion = suggestion.substring(text.length);
      }
      
      // Trim any leading/trailing whitespace
      suggestion = suggestion.trim();
      
      sendResponse({ success: true, suggestion });
    } else {
      // Handle cases where no content is returned
      sendResponse({ success: false, error: 'No suggestion content received from API' });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message || 'Error getting suggestion' });
  }
}
