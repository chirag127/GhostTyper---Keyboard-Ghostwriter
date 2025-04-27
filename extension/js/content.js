/**
 * Content Script for GhostTyper
 * 
 * This script is injected into web pages and handles:
 * - Detecting and monitoring text input fields
 * - Capturing text context for suggestion generation
 * - Displaying suggestions based on user's chosen presentation mode
 * - Handling keyboard events for accepting/dismissing suggestions
 */

// Import utility functions
import {
  debounce,
  matchesUrlPattern,
  isTextInputField,
  getCursorPosition,
  setCursorPosition,
  getTextContent,
  setTextContent,
  insertTextAtCursor,
  getCursorCoordinates
} from './utils.js';

// State variables
let settings = {
  isEnabled: true,
  apiKey: '',
  siteList: [],
  triggerDelay: 500,
  presentationMode: 'inline'
};
let activeElement = null;
let currentSuggestion = '';
let suggestionElements = {
  inline: null,
  popup: null,
  panel: null
};
let telemetryData = {
  suggestionsShown: 0,
  suggestionsAccepted: 0
};

// Initialize the content script
async function initialize() {
  // Get settings from background script
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    settings = response.settings;
  } catch (error) {
    console.error('Error getting settings:', error);
  }
  
  // Check if the extension is enabled for this site
  if (!isEnabledForSite()) {
    return;
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up mutation observer to detect dynamically added elements
  setupMutationObserver();
  
  // Create suggestion elements
  createSuggestionElements();
  
  // Set up periodic telemetry reporting
  setInterval(reportTelemetry, 60000); // Report every minute
}

/**
 * Check if the extension is enabled for the current site
 * 
 * @returns {boolean} - Whether the extension is enabled
 */
function isEnabledForSite() {
  // Check if the extension is globally enabled
  if (!settings.isEnabled) {
    return false;
  }
  
  // Check if the current site is in the block list
  if (settings.siteList && settings.siteList.length > 0) {
    const currentUrl = window.location.href;
    if (matchesUrlPattern(currentUrl, settings.siteList)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Set up event listeners for text input fields
 */
function setupEventListeners() {
  // Listen for focus events on the document
  document.addEventListener('focusin', handleFocusIn);
  
  // Listen for keydown events on the document
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Set up mutation observer to detect dynamically added elements
 */
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Check if any added nodes are text input fields or contain text input fields
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isTextInputField(node)) {
              // Attach event listeners to the new text input field
              node.addEventListener('input', handleInput);
            } else if (node.querySelectorAll) {
              // Check for text input fields within the added node
              const textInputs = node.querySelectorAll('input, textarea, [contenteditable="true"]');
              for (const input of textInputs) {
                if (isTextInputField(input)) {
                  // Attach event listeners to the new text input field
                  input.addEventListener('input', handleInput);
                }
              }
            }
          }
        }
      }
    }
  });
  
  // Observe changes to the DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Find and attach event listeners to existing text input fields
  const textInputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
  for (const input of textInputs) {
    if (isTextInputField(input)) {
      input.addEventListener('input', handleInput);
    }
  }
}

/**
 * Create elements for displaying suggestions
 */
function createSuggestionElements() {
  // Create inline suggestion element (used for contenteditable elements)
  const inlineElement = document.createElement('span');
  inlineElement.className = 'ghosttyper-inline-suggestion';
  inlineElement.style.display = 'none';
  document.body.appendChild(inlineElement);
  suggestionElements.inline = inlineElement;
  
  // Create popup suggestion element
  const popupElement = document.createElement('div');
  popupElement.className = 'ghosttyper-popup-suggestion';
  popupElement.style.display = 'none';
  document.body.appendChild(popupElement);
  suggestionElements.popup = popupElement;
  
  // Create panel suggestion element
  const panelElement = document.createElement('div');
  panelElement.className = 'ghosttyper-panel-suggestion';
  panelElement.style.display = 'none';
  
  // Add header to panel
  const panelHeader = document.createElement('div');
  panelHeader.className = 'ghosttyper-panel-header';
  panelHeader.textContent = 'GhostTyper Suggestion';
  panelElement.appendChild(panelHeader);
  
  // Add content to panel
  const panelContent = document.createElement('div');
  panelContent.className = 'ghosttyper-panel-content';
  panelElement.appendChild(panelContent);
  
  // Add footer to panel
  const panelFooter = document.createElement('div');
  panelFooter.className = 'ghosttyper-panel-footer';
  panelFooter.textContent = 'Press Tab to accept, Esc to dismiss';
  panelElement.appendChild(panelFooter);
  
  document.body.appendChild(panelElement);
  suggestionElements.panel = panelElement;
}

/**
 * Handle focus in event
 * 
 * @param {Event} event - The focus event
 */
function handleFocusIn(event) {
  const element = event.target;
  
  // Check if the element is a text input field
  if (isTextInputField(element)) {
    activeElement = element;
  } else {
    activeElement = null;
    hideSuggestion();
  }
}

/**
 * Handle input event
 * 
 * @param {Event} event - The input event
 */
const handleInput = debounce((event) => {
  const element = event.target;
  
  // Check if the element is a text input field
  if (!isTextInputField(element)) {
    return;
  }
  
  // Update active element
  activeElement = element;
  
  // Get text context
  const text = getTextContent(element);
  const cursorPos = getCursorPosition(element);
  const context = text.substring(0, cursorPos);
  
  // Check if there's enough context to generate a suggestion
  if (context.trim().length < 3) {
    hideSuggestion();
    return;
  }
  
  // Generate suggestion
  generateSuggestion(context);
}, settings.triggerDelay);

/**
 * Handle keydown event
 * 
 * @param {KeyboardEvent} event - The keydown event
 */
function handleKeyDown(event) {
  // Check if there's an active element and a current suggestion
  if (!activeElement || !currentSuggestion) {
    return;
  }
  
  // Handle Tab key to accept suggestion
  if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
    // Prevent default Tab behavior
    event.preventDefault();
    
    // Accept the suggestion
    acceptSuggestion();
    
    // Record telemetry
    telemetryData.suggestionsAccepted++;
    
    return;
  }
  
  // Handle Escape key to dismiss suggestion
  if (event.key === 'Escape') {
    // Dismiss the suggestion
    hideSuggestion();
    return;
  }
  
  // Handle other keys that should dismiss the suggestion
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Enter'
  ) {
    // Dismiss the suggestion
    hideSuggestion();
  }
}

/**
 * Generate a suggestion for the given context
 * 
 * @param {string} context - The text context to generate a suggestion from
 */
async function generateSuggestion(context) {
  try {
    // Send message to background script to generate suggestion
    const response = await chrome.runtime.sendMessage({
      type: 'GENERATE_SUGGESTION',
      context
    });
    
    if (!response.success) {
      console.error('Error generating suggestion:', response.error);
      return;
    }
    
    // Store the suggestion
    currentSuggestion = response.suggestion;
    
    // Display the suggestion
    displaySuggestion();
    
    // Record telemetry
    telemetryData.suggestionsShown++;
  } catch (error) {
    console.error('Error generating suggestion:', error);
  }
}

/**
 * Display the current suggestion
 */
function displaySuggestion() {
  if (!activeElement || !currentSuggestion) {
    return;
  }
  
  // Display the suggestion based on the presentation mode
  switch (settings.presentationMode) {
    case 'inline':
      displayInlineSuggestion();
      break;
    case 'popup':
      displayPopupSuggestion();
      break;
    case 'panel':
      displayPanelSuggestion();
      break;
    default:
      displayInlineSuggestion();
  }
}

/**
 * Display an inline suggestion
 */
function displayInlineSuggestion() {
  // For input and textarea elements, we can modify the value directly
  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
    const cursorPos = getCursorPosition(activeElement);
    const currentText = getTextContent(activeElement);
    const textBeforeCursor = currentText.substring(0, cursorPos);
    const textAfterCursor = currentText.substring(cursorPos);
    
    // Create a temporary element to hold the combined text
    const tempElement = document.createElement('div');
    
    // Add text before cursor
    const beforeSpan = document.createElement('span');
    beforeSpan.textContent = textBeforeCursor;
    tempElement.appendChild(beforeSpan);
    
    // Add suggestion with gray styling
    const suggestionSpan = document.createElement('span');
    suggestionSpan.textContent = currentSuggestion;
    suggestionSpan.style.color = '#999';
    tempElement.appendChild(suggestionSpan);
    
    // Add text after cursor
    const afterSpan = document.createElement('span');
    afterSpan.textContent = textAfterCursor;
    tempElement.appendChild(afterSpan);
    
    // Set the value of the input/textarea
    // This is a visual trick - we're not actually changing the value
    // We're just showing what it would look like with the suggestion
    
    // For contenteditable elements, we need to use the inline suggestion element
  } else if (activeElement.isContentEditable) {
    const coords = getCursorCoordinates(activeElement);
    
    // Position the inline suggestion element
    suggestionElements.inline.style.position = 'absolute';
    suggestionElements.inline.style.top = `${coords.top}px`;
    suggestionElements.inline.style.left = `${coords.left}px`;
    suggestionElements.inline.style.color = '#999';
    suggestionElements.inline.style.pointerEvents = 'none';
    suggestionElements.inline.textContent = currentSuggestion;
    suggestionElements.inline.style.display = 'inline';
  }
}

/**
 * Display a popup suggestion
 */
function displayPopupSuggestion() {
  const coords = getCursorCoordinates(activeElement);
  
  // Position the popup suggestion element
  suggestionElements.popup.style.position = 'absolute';
  suggestionElements.popup.style.top = `${coords.top + 20}px`;
  suggestionElements.popup.style.left = `${coords.left}px`;
  suggestionElements.popup.textContent = currentSuggestion;
  suggestionElements.popup.style.display = 'block';
}

/**
 * Display a panel suggestion
 */
function displayPanelSuggestion() {
  // Get the panel content element
  const panelContent = suggestionElements.panel.querySelector('.ghosttyper-panel-content');
  
  // Set the suggestion text
  panelContent.textContent = currentSuggestion;
  
  // Show the panel
  suggestionElements.panel.style.display = 'block';
}

/**
 * Hide the current suggestion
 */
function hideSuggestion() {
  // Clear the current suggestion
  currentSuggestion = '';
  
  // Hide all suggestion elements
  suggestionElements.inline.style.display = 'none';
  suggestionElements.popup.style.display = 'none';
  suggestionElements.panel.style.display = 'none';
  
  // For input and textarea elements, restore the original value
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    // No need to do anything, as we're using a visual trick
  }
}

/**
 * Accept the current suggestion
 */
function acceptSuggestion() {
  if (!activeElement || !currentSuggestion) {
    return;
  }
  
  // Insert the suggestion at the cursor position
  insertTextAtCursor(activeElement, currentSuggestion);
  
  // Hide the suggestion
  hideSuggestion();
  
  // Trigger an input event to potentially generate a new suggestion
  activeElement.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Report telemetry data to the background script
 */
async function reportTelemetry() {
  // Check if there's any telemetry data to report
  if (telemetryData.suggestionsShown === 0 && telemetryData.suggestionsAccepted === 0) {
    return;
  }
  
  try {
    // Send telemetry data to background script
    await chrome.runtime.sendMessage({
      type: 'RECORD_TELEMETRY',
      data: { ...telemetryData }
    });
    
    // Reset telemetry data
    telemetryData.suggestionsShown = 0;
    telemetryData.suggestionsAccepted = 0;
  } catch (error) {
    console.error('Error reporting telemetry:', error);
  }
}

// Initialize the content script
initialize();
