/**
 * GhostTyper - Content Script
 * Monitors text input fields and displays inline suggestions
 */

// Global variables
let settings = null;
let currentSuggestion = null;
let suggestionElement = null;
let loadingElement = null;
let typingTimer = null;
let isWaitingForSuggestion = false;
let activeElement = null;

// Initialize the content script
initialize();

/**
 * Initializes the content script
 */
function initialize() {
  // Get settings from background script
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    settings = response;
    
    // Set up event listeners for text input fields
    setupEventListeners();
    
    // Listen for settings changes
    chrome.storage.onChanged.addListener(handleSettingsChange);
  });
}

/**
 * Sets up event listeners for text input fields
 */
function setupEventListeners() {
  // Listen for focus events on the document
  document.addEventListener('focusin', handleFocusIn);
  
  // Listen for keydown events to handle Tab and Escape keys
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handles focus events on text input fields
 * @param {Event} event - The focus event
 */
function handleFocusIn(event) {
  const element = event.target;
  
  // Check if the element is a valid text input field
  if (isValidTextField(element)) {
    // Set the active element
    activeElement = element;
    
    // Add input event listener to the element
    element.addEventListener('input', handleInput);
    
    // Add blur event listener to the element
    element.addEventListener('blur', handleBlur);
    
    // Add click event listener to the element
    element.addEventListener('click', handleClick);
    
    // Add selection change event listener
    element.addEventListener('select', handleSelectionChange);
    element.addEventListener('keyup', handleSelectionChange);
  }
}

/**
 * Handles input events on text input fields
 * @param {Event} event - The input event
 */
function handleInput(event) {
  // Clear any existing suggestion
  clearSuggestion();
  
  // Clear any existing timer
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  
  // Check if GhostTyper is enabled and the site is not blacklisted
  if (!isEnabled() || isBlacklisted()) {
    return;
  }
  
  // Set a timer to get a suggestion after the user stops typing
  typingTimer = setTimeout(() => {
    getSuggestion(event.target);
  }, settings.suggestionDelay);
}

/**
 * Handles blur events on text input fields
 */
function handleBlur() {
  // Clear any existing suggestion
  clearSuggestion();
  
  // Clear any existing timer
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
}

/**
 * Handles click events on text input fields
 */
function handleClick() {
  // Clear any existing suggestion
  clearSuggestion();
  
  // Clear any existing timer
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
}

/**
 * Handles selection change events on text input fields
 */
function handleSelectionChange() {
  // Clear any existing suggestion
  clearSuggestion();
  
  // Clear any existing timer
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
}

/**
 * Handles keydown events to detect Tab and Escape keys
 * @param {KeyboardEvent} event - The keydown event
 */
function handleKeyDown(event) {
  // Only process if we have an active element and a current suggestion
  if (!activeElement || !currentSuggestion) {
    return;
  }
  
  // Check if the event target is our active element
  if (event.target !== activeElement) {
    return;
  }
  
  // Handle Tab key to accept suggestion
  if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
    // Prevent the default Tab behavior
    event.preventDefault();
    
    // Accept the suggestion
    acceptSuggestion();
  }
  
  // Handle Escape key to dismiss suggestion
  if (event.key === 'Escape') {
    // Clear the suggestion
    clearSuggestion();
  }
  
  // Handle any other key press to clear suggestion
  if (event.key !== 'Tab' && event.key !== 'Escape') {
    // We'll let the input event handler take care of clearing the suggestion
  }
}

/**
 * Handles settings changes
 * @param {Object} changes - The changed settings
 */
function handleSettingsChange(changes) {
  // Update the settings object with the changed values
  if (changes.isGloballyEnabled) {
    settings.isGloballyEnabled = changes.isGloballyEnabled.newValue;
  }
  
  if (changes.geminiApiKey) {
    settings.geminiApiKey = changes.geminiApiKey.newValue;
  }
  
  if (changes.blacklist) {
    settings.blacklist = changes.blacklist.newValue;
  }
  
  if (changes.suggestionDelay) {
    settings.suggestionDelay = changes.suggestionDelay.newValue;
  }
  
  // Clear any existing suggestion
  clearSuggestion();
}

/**
 * Checks if the extension is enabled
 * @returns {boolean} - Whether the extension is enabled
 */
function isEnabled() {
  return settings && settings.isGloballyEnabled && settings.geminiApiKey;
}

/**
 * Checks if the current site is blacklisted
 * @returns {boolean} - Whether the current site is blacklisted
 */
function isBlacklisted() {
  if (!settings || !settings.blacklist || !settings.blacklist.length) {
    return false;
  }
  
  const hostname = window.location.hostname;
  
  // Check if the hostname matches any entry in the blacklist
  return settings.blacklist.some(entry => {
    // Remove any protocol and www prefix for comparison
    const cleanEntry = entry.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    return hostname === cleanEntry || hostname.endsWith('.' + cleanEntry);
  });
}

/**
 * Checks if an element is a valid text input field
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is a valid text input field
 */
function isValidTextField(element) {
  // Check if the element is an input or textarea
  if (!element || !(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    return false;
  }
  
  // Check if the element is a password field
  if (element.type === 'password') {
    return false;
  }
  
  // For input elements, only allow text, search, url, and email types
  if (element instanceof HTMLInputElement) {
    const validTypes = ['text', 'search', 'url', 'email'];
    return validTypes.includes(element.type);
  }
  
  // Textarea elements are always valid
  return true;
}

/**
 * Gets a suggestion for the current text
 * @param {HTMLElement} element - The text input element
 */
function getSuggestion(element) {
  // Check if we're already waiting for a suggestion
  if (isWaitingForSuggestion) {
    return;
  }
  
  // Get the current text and cursor position
  const text = getElementText(element);
  const cursorPosition = getElementCursorPosition(element);
  
  // If there's no text or the cursor is at the beginning, don't get a suggestion
  if (!text || cursorPosition === 0) {
    return;
  }
  
  // Get the text before the cursor
  const textBeforeCursor = text.substring(0, cursorPosition);
  
  // If the text before the cursor is just whitespace, don't get a suggestion
  if (textBeforeCursor.trim() === '') {
    return;
  }
  
  // Show loading indicator
  showLoadingIndicator(element);
  
  // Set the waiting flag
  isWaitingForSuggestion = true;
  
  // Send a message to the background script to get a suggestion
  chrome.runtime.sendMessage(
    { action: 'getSuggestion', text: textBeforeCursor },
    (response) => {
      // Clear the waiting flag
      isWaitingForSuggestion = false;
      
      // Hide loading indicator
      hideLoadingIndicator();
      
      // Check if the response was successful
      if (response && response.success && response.suggestion) {
        // Show the suggestion
        showSuggestion(element, response.suggestion);
      }
    }
  );
}

/**
 * Shows a suggestion inline after the cursor
 * @param {HTMLElement} element - The text input element
 * @param {string} suggestion - The suggestion text
 */
function showSuggestion(element, suggestion) {
  // Clear any existing suggestion
  clearSuggestion();
  
  // Save the current suggestion
  currentSuggestion = suggestion;
  
  // Create a suggestion element
  suggestionElement = document.createElement('span');
  suggestionElement.className = 'ghosttyper-suggestion';
  suggestionElement.textContent = suggestion;
  
  // For input and textarea elements, we need to use a different approach
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    // Position the suggestion element
    positionSuggestionElement(element, suggestionElement);
  }
}

/**
 * Positions the suggestion element relative to the input field
 * @param {HTMLElement} inputElement - The text input element
 * @param {HTMLElement} suggestionEl - The suggestion element
 */
function positionSuggestionElement(inputElement, suggestionEl) {
  // Get the position of the cursor
  const cursorPosition = getElementCursorPosition(inputElement);
  
  // Get the text before the cursor
  const textBeforeCursor = getElementText(inputElement).substring(0, cursorPosition);
  
  // Create a temporary element to measure text width
  const measureElement = document.createElement('div');
  measureElement.style.position = 'absolute';
  measureElement.style.visibility = 'hidden';
  measureElement.style.whiteSpace = 'pre';
  measureElement.style.font = window.getComputedStyle(inputElement).font;
  measureElement.textContent = textBeforeCursor;
  document.body.appendChild(measureElement);
  
  // Get the width of the text before the cursor
  const textWidth = measureElement.offsetWidth;
  
  // Remove the measure element
  document.body.removeChild(measureElement);
  
  // Get the position and dimensions of the input element
  const inputRect = inputElement.getBoundingClientRect();
  
  // Create a container for the suggestion
  const container = document.createElement('div');
  container.className = 'ghosttyper-suggestion-container';
  container.style.position = 'absolute';
  container.style.left = `${inputRect.left + textWidth}px`;
  container.style.top = `${inputRect.top}px`;
  container.style.height = `${inputRect.height}px`;
  container.style.lineHeight = `${inputRect.height}px`;
  container.style.zIndex = '9999';
  container.style.pointerEvents = 'none';
  
  // Add the suggestion element to the container
  container.appendChild(suggestionEl);
  
  // Add the container to the document body
  document.body.appendChild(container);
  
  // Update the suggestion element reference to the container
  suggestionElement = container;
}

/**
 * Shows a loading indicator while waiting for a suggestion
 * @param {HTMLElement} element - The text input element
 */
function showLoadingIndicator(element) {
  // Create a loading element
  loadingElement = document.createElement('div');
  loadingElement.className = 'ghosttyper-loading';
  
  // Position the loading element
  const inputRect = element.getBoundingClientRect();
  loadingElement.style.position = 'absolute';
  loadingElement.style.left = `${inputRect.right + 5}px`;
  loadingElement.style.top = `${inputRect.top + (inputRect.height / 2) - 6}px`;
  loadingElement.style.zIndex = '9999';
  
  // Add the loading element to the document body
  document.body.appendChild(loadingElement);
}

/**
 * Hides the loading indicator
 */
function hideLoadingIndicator() {
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.parentNode.removeChild(loadingElement);
  }
  loadingElement = null;
}

/**
 * Accepts the current suggestion
 */
function acceptSuggestion() {
  if (!activeElement || !currentSuggestion) {
    return;
  }
  
  // Get the current text and cursor position
  const text = getElementText(activeElement);
  const cursorPosition = getElementCursorPosition(activeElement);
  
  // Insert the suggestion at the cursor position
  const newText = text.substring(0, cursorPosition) + currentSuggestion + text.substring(cursorPosition);
  
  // Update the element's text
  setElementText(activeElement, newText);
  
  // Move the cursor to the end of the suggestion
  setElementCursorPosition(activeElement, cursorPosition + currentSuggestion.length);
  
  // Clear the suggestion
  clearSuggestion();
}

/**
 * Clears the current suggestion
 */
function clearSuggestion() {
  // Clear the current suggestion
  currentSuggestion = null;
  
  // Remove the suggestion element from the DOM
  if (suggestionElement && suggestionElement.parentNode) {
    suggestionElement.parentNode.removeChild(suggestionElement);
  }
  suggestionElement = null;
  
  // Hide the loading indicator
  hideLoadingIndicator();
}

/**
 * Gets the text from an input element
 * @param {HTMLElement} element - The text input element
 * @returns {string} - The element's text
 */
function getElementText(element) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value || '';
  }
  return '';
}

/**
 * Sets the text of an input element
 * @param {HTMLElement} element - The text input element
 * @param {string} text - The text to set
 */
function setElementText(element, text) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = text;
    
    // Trigger an input event to notify other scripts of the change
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
  }
}

/**
 * Gets the cursor position in an input element
 * @param {HTMLElement} element - The text input element
 * @returns {number} - The cursor position
 */
function getElementCursorPosition(element) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.selectionStart || 0;
  }
  return 0;
}

/**
 * Sets the cursor position in an input element
 * @param {HTMLElement} element - The text input element
 * @param {number} position - The cursor position to set
 */
function setElementCursorPosition(element, position) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.setSelectionRange(position, position);
  }
}
