/**
 * Popup Script for GhostTyper
 *
 * This script handles the popup UI when clicking the extension icon.
 * It displays the current status of the extension and provides a link to the options page.
 */

// DOM elements
const statusDot = document.querySelector(".status-dot");
const statusText = document.querySelector(".status-text");
const apiKeyIndicator = document.querySelector(".api-key-indicator");
const apiKeyText = document.querySelector(".api-key-text");
const backendIndicator = document.querySelector(".backend-indicator");
const backendText = document.querySelector(".backend-text");
const openOptionsBtn = document.getElementById("openOptionsBtn");

// Default backend URL
const DEFAULT_BACKEND_URL = "http://localhost:3000";

// Initialize the popup
async function initialize() {
    // Get settings from storage
    const settings = await chrome.storage.local.get([
        "isEnabled",
        "apiKey",
        "backendUrl",
    ]);

    // Update status indicators
    updateStatusIndicator(settings.isEnabled);
    updateApiKeyIndicator(settings.apiKey);
    updateBackendIndicator(settings.backendUrl || DEFAULT_BACKEND_URL);

    // Add event listener for options button
    openOptionsBtn.addEventListener("click", openOptionsPage);
}

/**
 * Update the status indicator
 *
 * @param {boolean} isEnabled - Whether the extension is enabled
 */
function updateStatusIndicator(isEnabled) {
    if (isEnabled) {
        statusDot.classList.add("active");
        statusDot.classList.remove("inactive");
        statusText.textContent = "Status: Active";
    } else {
        statusDot.classList.add("inactive");
        statusDot.classList.remove("active");
        statusText.textContent = "Status: Inactive";
    }
}

/**
 * Update the API key indicator
 *
 * @param {string} apiKey - The API key
 */
function updateApiKeyIndicator(apiKey) {
    if (apiKey) {
        apiKeyIndicator.classList.add("set");
        apiKeyIndicator.classList.remove("not-set");
        apiKeyText.textContent = "API Key: Set";
    } else {
        apiKeyIndicator.classList.add("not-set");
        apiKeyIndicator.classList.remove("set");
        apiKeyText.textContent = "API Key: Not Set";
    }
}

/**
 * Update the backend indicator
 *
 * @param {string} backendUrl - The backend URL
 */
function updateBackendIndicator(backendUrl) {
    // Check if backend is reachable
    fetch(`${backendUrl}`)
        .then((response) => {
            if (response.ok) {
                backendIndicator.classList.add("set");
                backendIndicator.classList.remove("not-set");
                backendText.textContent = "Backend: Connected";
            } else {
                throw new Error("Backend not reachable");
            }
        })
        .catch((error) => {
            backendIndicator.classList.add("not-set");
            backendIndicator.classList.remove("set");
            backendText.textContent = "Backend: Not Connected";
            console.error("Error checking backend:", error);
        });
}

/**
 * Open the options page
 */
function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

// Initialize the popup
initialize();
