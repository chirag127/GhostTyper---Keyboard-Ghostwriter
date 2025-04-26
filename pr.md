

**GhostTyper - Product Requirements Document (PRD)**

**Document Version:** 1.0
**Last Updated:** 2024-05-16
**Owner:** Chirag Singhal
**Status:** Final
**Prepared for:** AI Code Assistant (Augment Code Assistant)
**Prepared by:** Chirag Singhal (facilitated by CTO Assistant)

---

**1. Introduction & Overview**

*   **1.1. Purpose:** This document outlines the requirements for GhostTyper, a browser extension designed to provide real-time, inline AI-powered writing suggestions to users as they type in web forms and text fields.
*   **1.2. Problem Statement:** Users often need assistance formulating sentences, completing thoughts, or improving their writing clarity while typing online (emails, documents, social media, etc.). Switching context to use separate AI tools is inefficient.
*   **1.3. Vision / High-Level Solution:** GhostTyper aims to be the "GitHub Copilot for everyday writing." It will integrate seamlessly into the user's browsing experience, offering contextual suggestions directly within the text fields they are using. Suggestions are accepted easily via the `Tab` key.

**2. Goals & Objectives**

*   **2.1. Business Goals:**
    *   Provide a valuable writing assistance tool to enhance user productivity.
    *   Create a seamless and intuitive user experience.
    *   Build a foundation for potential future premium features or model integrations.
*   **2.2. Product Goals:**
    *   Deliver accurate and contextually relevant writing suggestions in real-time.
    *   Ensure minimal performance impact on the user's browser.
    *   Provide users with clear controls over the extension's behavior (activation, site preferences, API key).
    *   Achieve high user satisfaction through ease of use and helpfulness.
*   **2.3. Success Metrics (KPIs):**
    *   Number of active installs.
    *   Frequency of suggestion acceptance (`Tab` key presses).
    *   User-reported satisfaction/ratings.
    *   Low rate of uninstalls.
    *   Low number of reported performance issues or conflicts.

**3. Scope**

*   **3.1. In Scope:**
    *   Browser extension for Chrome, Firefox, and Edge (Chromium).
    *   Monitoring text input fields (specifically `<textarea>` and relevant `<input type="text">`, etc., excluding passwords).
    *   Triggering AI suggestions after a user pauses typing (configurable delay, default ~500ms).
    *   Displaying a single, inline, grayed-out suggestion after the cursor.
    *   Accepting the suggestion upon `Tab` key press.
    *   Using the Google Gemini API via user-provided API keys for generating suggestions. (Use the provided JavaScript code snippet for integration).
    *   Providing an extension popup for settings:
        *   API Key input and validation (basic check for format).
        *   Global Enable/Disable toggle.
        *   Per-site enable/disable list (Whitelist/Blacklist).
        *   Suggestion trigger delay adjustment.
    *   Automatic disabling of suggestions in password fields (`input type="password"`).
    *   Graceful error handling for API issues (notify user via popup, temporary disable).
    *   Clean, minimal UI design.
    *   Focus on performance and low resource consumption.
    *   **Final Product:** Build a complete, polished, and production-ready extension. No features should be deferred as "MVP scope".
    *   **Project Structure:** Use `extension/` folder for all browser extension code.
    *   **Documentation:** Well-documented code following best practices.
    *   **Testing:** Ensure the extension is fully functional and tested across target browsers.
*   **3.2. Out of Scope:**
    *   Support for browsers other than Chrome, Firefox, Edge.
    *   Providing multiple suggestions simultaneously or cycling through alternatives.
    *   Advanced suggestion customization (tone, style, length beyond basic prompt engineering).
    *   Support for AI models other than Google Gemini (in this version).
    *   Backend server for centralized API key management or user accounts.
    *   Caching suggestions.
    *   Language translation features.
    *   Suggestions within complex web editors (e.g., Google Docs, Notion) which might require specific integrations. Focus on standard HTML text fields first.
    *   Collecting user typing data beyond the necessary context for the API call.

**4. User Personas & Scenarios**

*   **4.1. Primary Persona(s):**
    *   **Alex (Frequent Writer):** Writes many emails, reports, and social media posts daily. Wants to speed up writing and improve phrasing without breaking workflow. Is comfortable managing an API key.
    *   **Sam (Non-Native Speaker):** Uses the web extensively for communication. Wants real-time help with grammar and sentence completion to sound more natural.
*   **4.2. Key User Scenarios / Use Cases:**
    *   **Email Composition:** Alex is writing an email and pauses mid-sentence. GhostTyper suggests a way to complete the sentence. Alex hits `Tab` to accept.
    *   **Form Filling:** Sam is filling out a feedback form and wants to express a point clearly. GhostTyper provides suggestions as Sam types, helping refine the message.
    *   **Configuration:** Alex wants to disable GhostTyper on a specific internal company website. Alex opens the extension popup, adds the domain to the blacklist, and saves.
    *   **API Key Setup:** A new user installs GhostTyper, opens the popup, clicks on settings, and is prompted to enter their Google AI API Key with a link to instructions on how to obtain one.
    *   **Error Encounter:** GhostTyper fails to get a suggestion due to an invalid API key. The extension icon shows a small error badge, and the popup displays a message like "API Error - Check Settings." Suggestions are temporarily paused.

**5. User Stories**

*   **US1:** As a user, I want to see inline writing suggestions automatically appear after I pause typing in a text field, so I can get help without interrupting my flow.
*   **US2:** As a user, I want to accept a suggestion simply by pressing the `Tab` key, so I can incorporate it quickly.
*   **US3:** As a user, I want to provide my own Google AI API key, so I can control my usage and costs.
*   **US4:** As a user, I want to globally enable or disable the extension easily via the popup, so I have full control over its activation.
*   **US5:** As a user, I want to specify websites where the extension should or should not be active, so I can avoid suggestions in sensitive contexts or on incompatible sites.
*   **US6:** As a user, I want the extension to automatically avoid giving suggestions in password fields, for security and privacy.
*   **US7:** As a user, I want to be notified discreetly if the AI suggestions are not working (e.g., due to an API error), so I know why it's not active.
*   **US8:** As a user, I want the extension to be lightweight and performant, so it doesn't slow down my browser or interfere with website functionality.
*   **US9:** As a user, I want to adjust the pause duration before a suggestion appears, so I can fine-tune it to my typing speed.

**6. Functional Requirements (FR)**

*   **6.1. Core Suggestion Engine:**
    *   **FR1.1:** Detect user typing activity in standard web text input fields (`textarea`, applicable `input` types).
    *   **FR1.2:** Detect when the user has paused typing for a configurable duration (default ~500ms).
    *   **FR1.3:** Extract the text context (current paragraph) preceding the cursor position upon pause detection.
    *   **FR1.4:** Send the extracted context to the Google Gemini API using the user-provided API key via the specified JavaScript integration method. The prompt should be structured similarly to: "Continue the following text:\n\n[Current paragraph context]".
    *   **FR1.5:** Receive the text suggestion response from the API.
    *   **FR1.6:** Sanitize/clean the received suggestion (e.g., trim whitespace).
    *   **FR1.7:** Display the suggestion inline immediately after the cursor as subtle, grayed-out text.
    *   **FR1.8:** Monitor for `Tab` key press when a suggestion is displayed.
    *   **FR1.9:** If `Tab` is pressed, replace the grayed-out suggestion with actual text and reposition the cursor to the end.
    *   **FR1.10:** If the user types anything else or moves the cursor, discard the current suggestion.
    *   **FR1.11:** Automatically disable suggestion triggering in fields identified as `input type="password"`.
*   **6.2. Extension Popup & Settings:**
    *   **FR2.1:** Provide a browser action button (extension icon).
    *   **FR2.2:** Clicking the icon opens a popup UI.
    *   **FR2.3:** Popup displays:
        *   Global Enable/Disable toggle switch.
        *   Link/Button to Settings view.
        *   Status indicator (e.g., "Active", "Disabled", "API Error").
    *   **FR2.4:** Settings view contains:
        *   Input field for Google AI API Key.
        *   Button to save/validate the key (basic format check).
        *   Link to instructions for obtaining a Google AI API Key.
        *   Interface to manage per-site behavior (add/remove URLs for whitelist/blacklist). Default should be enabled everywhere unless blacklisted.
        *   Input field/slider to adjust the suggestion trigger delay (e.g., 300ms - 1500ms).
    *   **FR2.5:** Persistently store user settings (API key securely, toggle state, site list, delay) using `chrome.storage.local` or equivalent.
*   **6.3. Error Handling & Notifications:**
    *   **FR3.1:** Detect API call failures (network errors, invalid key, rate limits, Gemini errors).
    *   **FR3.2:** On API failure, temporarily pause suggestion functionality.
    *   **FR3.3:** Update the extension icon (e.g., small badge) and popup status to indicate an error.
    *   **FR3.4:** Provide a clear error message in the popup (e.g., "API Key Invalid", "Network Error", "Check Settings").
    *   **FR3.5:** Attempt to resume functionality periodically or upon user interaction (e.g., re-saving settings).

**7. Non-Functional Requirements (NFR)**

*   **7.1. Performance:**
    *   **NFR1.1:** Suggestion latency (time from pause trigger to suggestion display) should ideally be under 500ms (excluding API response time).
    *   **NFR1.2:** Content script impact on page load and responsiveness must be negligible.
    *   **NFR1.3:** Minimize CPU and memory consumption. Avoid background loops polling aggressively. Use event-driven listeners where possible.
*   **7.2. Scalability:**
    *   **NFR2.1:** The extension architecture should rely solely on client-side processing and the external Google AI API. No backend server is required for this version, ensuring scalability relies on the user's machine and the API provider.
*   **7.3. Usability:**
    *   **NFR3.1:** The inline suggestion mechanism must feel intuitive and unobtrusive.
    *   **NFR3.2:** The extension popup and settings must be easy to understand and navigate.
    *   **NFR3.3:** Error messages should be user-friendly and actionable.
*   **7.4. Reliability / Availability:**
    *   **NFR4.1:** The extension must function consistently across supported browsers (Chrome, Firefox, Edge).
    *   **NFR4.2:** Gracefully handle scenarios where text fields appear dynamically or within iFrames (best effort, might be limited by browser security).
*   **7.5. Security:**
    *   **NFR5.1:** User API keys must be stored securely using appropriate browser storage mechanisms (`chrome.storage.local`).
    *   **NFR5.2:** Avoid suggestion generation for password input fields (`type="password"`).
    *   **NFR5.3:** Ensure context sent to the API does not inadvertently include sensitive information beyond the typed paragraph (user is responsible for API key usage).
    *   **NFR5.4:** Sanitize all inputs and outputs to prevent potential injection attacks (though less critical without a backend).
*   **7.6. Accessibility:**
    *   **NFR6.1:** Ensure popup UI elements are keyboard navigable and compatible with screen readers (follow WCAG 2.1 A/AA guidelines where applicable).
    *   **NFR6.2:** The inline suggestion's appearance (gray text) should have sufficient contrast or alternative indicators if possible, though this is challenging.
*   **7.7. Maintainability:**
    *   **NFR7.1:** Code must be well-structured, modular, and include comments explaining complex logic.
    *   **NFR7.2:** Follow consistent coding style and best practices for JavaScript and WebExtensions.
    *   **NFR7.3:** Ensure the project structure (`extension/` folder) is clean and organized.

**8. UI/UX Requirements & Design**

*   **8.1. Wireframes / Mockups:** (To be developed based on description) - Focus on minimalism.
    *   *Inline Suggestion:* Light gray text appended to the user's current text.
    *   *Popup:* Simple panel with Logo/Name, Status, Global Toggle, Settings Gear Icon.
    *   *Settings View:* Clean list/form layout for API Key, Site List Management, Delay Slider.
*   **8.2. Key UI Elements:**
    *   Extension Icon (Simple Ghost logo).
    *   Popup Panel.
    *   Settings View/Page within Popup.
    *   Inline Suggestion Text Style.
    *   Error indicators (icon badge, popup text).
*   **8.3. User Flow Diagrams:** (Illustrative)
    *   *Suggestion Flow:* Type -> Pause -> API Call -> Suggestion Display -> Tab Press -> Accept.
    *   *Settings Flow:* Click Icon -> Click Settings -> Modify API Key/Site List/Delay -> Save.
    *   *Error Flow:* API Call Fails -> Pause Suggestions -> Show Error in Popup -> User Checks Settings.

**9. Data Requirements**

*   **9.1. Data Model:**
    *   **User Settings (stored via `chrome.storage.local`):**
        *   `apiKey`: string (encrypted or stored securely if browser provides mechanisms, otherwise plain text in local storage)
        *   `isEnabled`: boolean (global toggle state)
        *   `siteList`: array of objects `[{url: string, type: 'whitelist' | 'blacklist'}]` (using blacklist approach primarily)
        *   `suggestionDelay`: number (milliseconds)
        *   `hasSeenIntro`: boolean (optional, for onboarding)
    *   **Session Data (in-memory):**
        *   Current suggestion text.
        *   State of suggestion display (active/inactive).
        *   API error status.
*   **9.2. Data Migration:** Not applicable for V1.
*   **9.3. Analytics & Tracking:** None in this version to maximize privacy.

**10. Release Criteria**

*   **10.1. Functional Criteria:**
    *   All features listed in Scope (3.1) and Functional Requirements (6) are implemented and working correctly.
    *   Suggestions are generated accurately based on context.
    *   Tab completion works reliably.
    *   Settings (API Key, Toggle, Site List, Delay) are functional and persistent.
    *   Error handling behaves as specified.
    *   Works correctly on latest versions of Chrome, Firefox, and Edge.
*   **10.2. Non-Functional Criteria:**
    *   Performance targets (latency, resource usage) are met during testing.
    *   No significant interference with website loading or functionality observed on popular test sites.
    *   Security requirements (password field avoidance, key storage) are implemented.
    *   UI is clean, intuitive, and bug-free.
*   **10.3. Testing Criteria:**
    *   Manual testing covers all user scenarios and edge cases (different field types, rapid typing, slow network simulation).
    *   Cross-browser compatibility testing is complete.
    *   No critical or major bugs outstanding.
    *   Frontend must be demonstrably error-free in the browser console during normal operation.
*   **10.4. Documentation Criteria:**
    *   Code is well-documented.
    *   A basic README explaining installation and usage (including getting API key) is prepared.

**11. Open Issues / Future Considerations**

*   **11.1. Open Issues:**
    *   Finalizing the exact Gemini prompt for optimal suggestions.
    *   Handling complex text editors or WYSIWYG editors might require future enhancements.
*   **11.2. Future Enhancements (Post-Launch):**
    *   Support for alternative AI models (OpenAI, Anthropic) via settings.
    *   Allowing users to customize prompts or select writing styles/tones.
    *   Caching common suggestions locally to reduce API calls/latency.
    *   More granular context control (e.g., sending more/less text).
    *   Potential onboarding tour for new users.

**12. Appendix & Glossary**

*   **12.1. Glossary:**
    *   **Inline Suggestion:** AI-generated text appearing directly in the text field.
    *   **Content Script:** Extension code running within the context of a web page.
    *   **Background Script:** Extension code running in the background, managing state and API calls.
    *   **Popup:** UI shown when clicking the extension icon.
    *   **Gemini API:** Google's Large Language Model API used for generating suggestions.
*   **12.2. Related Documents:**
    *   (Link to designs/wireframes if available)
    *   (Link to Google AI/Gemini documentation)

**13. Document History / Revisions**

*   **Version 1.0 (2024-05-16):** Initial draft based on planning discussion.

---

**Instructions for the AI Code Assistant:**

1.  **Goal:** Build the GhostTyper browser extension as defined in this PRD.
2.  **Target Platform:** Browser Extension (Chrome, Firefox, Edge).
3.  **Project Structure:** Use an `extension/` folder for all source code (`manifest.json`, background scripts, content scripts, popup HTML/JS/CSS, assets).
4.  **Technology:** Use standard WebExtensions APIs, HTML, CSS, and JavaScript.
5.  **Gemini Integration:** Implement the API call using the provided JavaScript code snippet structure within the background script or appropriate module. Ensure the user's API key (from storage) is used.
    ```javascript
    // NOTE: Adapt this structure for Browser Extension environment (e.g., using fetch, background script context)
    // You will need to handle fetching the API key from chrome.storage and constructing the request body.
    // The core logic of making a POST request to the Gemini API endpoint remains similar.
    // Example adaptation sketch:

    async function getGeminiSuggestion(apiKey, promptText) {
        // Ensure you use the correct endpoint for the specified model
        const model = 'gemini-1.5-flash-latest'; // Or the specific model needed
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                role: 'user',
                parts: [{ text: promptText }]
            }],
            // Optional: Add generationConfig if needed (temperature, maxOutputTokens etc.)
             generationConfig: {
                 // Example: Adjust max output tokens if needed
                 maxOutputTokens: 50,
                 // Ensure response mimeType is plain text if required by parsing logic
                 // responseMimeType: 'text/plain' // This might be needed depending on model/endpoint version
             }
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                // Handle non-2xx responses (invalid key, rate limit, server error)
                const errorData = await response.json();
                console.error("Gemini API Error:", response.status, errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();

            // Extract the text suggestion - path might vary slightly based on exact Gemini model/version response structure
            // Check for candidates and safety ratings
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                 // Check for safety blocks
                if (data.candidates[0].finishReason === 'SAFETY') {
                    console.warn("Suggestion blocked due to safety settings.");
                    return ""; // Return empty or handle as appropriate
                }
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                 // Handle cases where no content is returned or structure is unexpected
                 console.warn("No suggestion content received from API:", data);
                 // Check for promptFeedback if available for blocked prompts
                 if (data.promptFeedback?.blockReason) {
                     console.warn(`Prompt blocked: ${data.promptFeedback.blockReason}`);
                 }
                 return ""; // Return empty string if no suggestion found
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Propagate the error or handle it (e.g., return null/empty string, set error state)
            throw error; // Re-throw to be caught by the calling function for error handling logic
        }
    }
    ```
6.  **Quality:** Deliver a complete, production-ready solution. The code must be well-documented, follow best practices (ES Modules, async/await), be maintainable, and thoroughly tested.
7.  **Performance:** Prioritize performance and minimize resource usage. Use efficient event listeners and avoid unnecessary computations in content scripts.
8.  **Error Handling:** Implement robust error handling, especially for API calls and user settings storage/retrieval. Ensure the frontend UI is error-free during typical operation (check browser console).
9.  **Final Product:** This PRD describes the final product, not an MVP. All specified features ("In Scope") must be included.
