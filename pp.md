
**GhostTyper - Product Requirements Document (PRD)**

**Document Version:** 1.0
**Last Updated:** 2023-10-27
**Owner:** Chirag Singhal
**Status:** Final
**Prepared for:** augment code assistant (AI Code Generation Agent)
**Prepared by:** Chirag Singhal (via Friendly CTO Assistant)

---

**1. Introduction & Overview**

*   **1.1. Purpose:** This document outlines the requirements for GhostTyper, a browser extension designed to provide real-time, inline AI-powered writing suggestions to users as they type in web forms and text fields.
*   **1.2. Problem Statement:** Users often struggle with writer's block, finding the right words, or simply writing efficiently online. Existing tools may require copy-pasting or navigating away from the current context, disrupting workflow.
*   **1.3. Vision / High-Level Solution:** GhostTyper aims to be the "GitHub Copilot for everyday writing." It integrates seamlessly into the user's browser (initially Google Chrome), offering context-aware suggestions directly within the text fields they are using. Users can accept suggestions instantly using the Tab key, leading to faster, more confident writing and overcoming creative blocks. The extension will leverage the user's own Gemini API key for generating suggestions.

**2. Goals & Objectives**

*   **2.1. Business Goals:**
    *   Provide a valuable, free writing enhancement tool to users.
    *   Establish a foundation for potential future features or versions.
    *   (Initial Phase) Achieve significant user adoption within the Chrome ecosystem.
*   **2.2. Product Goals:**
    *   Deliver a seamless, intuitive, and real-time writing suggestion experience.
    *   Ensure high performance with minimal perceivable typing latency.
    *   Provide users with control over the extension's behavior and their API key usage.
    *   Build a robust and maintainable extension ready for production use.
*   **2.3. Success Metrics (KPIs):**
    *   High number of active daily/weekly users.
    *   High suggestion acceptance rate (tracked via anonymous, opt-in telemetry if backend is utilized for this).
    *   Positive user ratings and reviews in the Chrome Web Store.

**3. Scope**

*   **3.1. In Scope:**
    *   Google Chrome Browser Extension.
    *   Real-time inline AI suggestions using Google Gemini API.
    *   User provides their own Gemini API key.
    *   Suggestion triggering after a user-configurable pause in typing (default 500ms).
    *   Suggestion acceptance via 'Tab' key.
    *   Multiple suggestion presentation modes (configurable):
        *   Inline faded text (Default)
        *   Small popup near cursor
        *   Dedicated side panel
    *   Extension options page including:
        *   API Key input/update/clear (`chrome.storage.local`).
        *   Global enable/disable toggle.
        *   Site-specific enable/disable (allow/block list).
        *   Adjustable suggestion trigger delay.
        *   Selection of suggestion presentation mode.
    *   Basic backend structure (`backend/` folder with Node.js/Express skeleton) prepared for potential future use (e.g., telemetry, user accounts) but not essential for core V1 functionality relying on local API key storage.
    *   Graceful error handling (invalid API key, network issues, incompatible fields).
    *   Secure storage of API key using `chrome.storage.local`.
    *   Well-documented, maintainable, production-ready code.
    *   Use of the provided Gemini integration code structure (see Appendix).
*   **3.2. Out of Scope:**
    *   Support for browsers other than Google Chrome (initially).
    *   Backend-managed API keys or user authentication system (for V1).
    *   Advanced AI model configuration beyond what Gemini API supports via the provided snippet.
    *   Complex prompt engineering features within the extension.
    *   Monetization features (V1 is free).
    *   Offline functionality (requires API connection).
    *   Support for rich text editors that heavily manipulate the DOM in non-standard ways (best-effort support).

**4. User Personas & Scenarios**

*   **4.1. Primary Persona(s):**
    *   **Alex the Blogger:** Writes articles directly in a CMS. Needs help phrasing sentences and overcoming writer's block quickly without breaking flow.
    *   **Sam the Student:** Writes essays and forum posts online. Wants to improve writing clarity and speed for assignments and discussions.
    *   **Charlie the Professional:** Composes emails and reports in web-based tools. Needs assistance crafting concise and professional communication efficiently.
*   **4.2. Key User Scenarios / Use Cases:**
    *   **UC1: First-time Setup:** User installs the extension, navigates to options, enters their Gemini API key, and saves it.
    *   **UC2: Getting Suggestions:** User types in a text field (e.g., email compose window), pauses briefly, sees an inline suggestion appear.
    *   **UC3: Accepting Suggestion:** User likes the suggestion and presses 'Tab' to accept it, the suggested text is added.
    *   **UC4: Ignoring Suggestion:** User sees a suggestion but continues typing; the suggestion disappears.
    *   **UC5: Configuring Settings:** User opens options, changes the trigger delay, and switches the presentation mode to 'popup'.
    *   **UC6: Disabling on Specific Site:** User navigates to a specific website, clicks the extension icon, and adds the site to the block list.
    *   **UC7: Handling API Key Error:** User enters an invalid API key; the extension icon indicates an error, and the options page shows a relevant message.

**5. User Stories**

*   **US1:** As a user, I want to enter my Gemini API key in the extension settings so that GhostTyper can generate suggestions for me.
*   **US2:** As a user, I want GhostTyper to automatically show writing suggestions inline after I pause typing so that I can get help without interrupting my flow.
*   **US3:** As a user, I want to press the 'Tab' key to accept a suggestion so that I can quickly incorporate the AI's help.
*   **US4:** As a user, I want to configure the delay before suggestions appear so that I can customize it to my typing speed.
*   **US5:** As a user, I want to choose how suggestions are displayed (inline, popup, sidebar) so that I can pick the mode that best suits my workflow.
*   **US6:** As a user, I want to disable GhostTyper on specific websites so that it doesn't interfere with sites where I don't need it.
*   **US7:** As a user, I want clear feedback if my API key is invalid or there's an issue connecting to the AI so that I can troubleshoot the problem.

**6. Functional Requirements (FR)**

*   **6.1. Core Suggestion Engine**
    *   **FR1.1:** The extension MUST monitor user typing in standard HTML text input fields (`<input type="text">`, `<textarea>`) and content-editable elements across web pages (best-effort for content-editable).
    *   **FR1.2:** When the user pauses typing for a configurable duration (default 500ms), the extension MUST capture the preceding text context.
    *   **FR1.3:** The extension MUST send the captured context to the Google Gemini API using the user-provided API key via the specified JavaScript integration method (see Appendix).
    *   **FR1.4:** The extension MUST process the AI response to extract the relevant writing suggestion.
    *   **FR1.5:** The extension MUST display the suggestion according to the user's selected presentation mode (inline default, popup, sidebar).
    *   **FR1.6:** Inline suggestions MUST appear as subtle, faded text immediately following the user's cursor.
    *   **FR1.7:** The extension MUST listen for the 'Tab' key press when a suggestion is active.
    *   **FR1.8:** On 'Tab' press, the extension MUST insert the suggestion text and place the cursor at the end of the inserted text.
    *   **FR1.9:** If the user continues typing instead of pressing 'Tab', the suggestion MUST disappear.
*   **6.2. Configuration & Settings**
    *   **FR2.1:** The extension MUST provide an options page accessible via the browser's extension management area.
    *   **FR2.2:** The options page MUST allow users to securely input, update, and clear their Gemini API key.
    *   **FR2.3:** The API key MUST be stored securely using `chrome.storage.local`.
    *   **FR2.4:** The options page MUST provide a global toggle switch to enable/disable the extension's functionality entirely.
    *   **FR2.5:** The options page MUST allow users to manage a list of blocked websites where the extension will not activate.
    *   **FR2.6:** The options page MUST allow users to adjust the typing pause duration (trigger delay) in milliseconds (e.g., via a slider or number input).
    *   **FR2.7:** The options page MUST allow users to select the preferred suggestion presentation mode (Inline, Popup, Sidebar).
*   **6.3. Error Handling & Feedback**
    *   **FR3.1:** If the Gemini API returns an error (e.g., invalid key, quota exceeded), the extension MUST disable suggestions and provide clear feedback to the user (e.g., error icon on extension button, message in options page).
    *   **FR3.2:** If API requests are slow or time out (e.g., > 5-10 seconds), the extension MUST gracefully handle the timeout without freezing the browser and potentially indicate a temporary issue.
    *   **FR3.3:** The extension MUST attempt to detect incompatible input fields (e.g., password fields, complex custom editors) and silently disable itself for those specific fields.

**7. Non-Functional Requirements (NFR)**

*   **7.1. Performance**
    *   **NFR1.1:** Typing Latency: Interaction with the extension (monitoring typing, showing/accepting suggestions) MUST introduce minimal to zero perceivable lag to the user's typing experience. API call latency is acceptable, but the UI must remain responsive.
    *   **NFR1.2:** Resource Usage: The extension MUST be efficient in terms of CPU and memory usage to avoid slowing down the user's browser. Debouncing and efficient event handling are critical.
*   **7.2. Scalability**
    *   **NFR2.1:** Extension Scalability: The extension code MUST be structured to handle potential increases in complexity (e.g., adding more configuration options, refining suggestion logic).
    *   **NFR2.2:** Backend Scalability: The initial backend skeleton (Node.js/Express) SHOULD be set up using standard practices that allow for future scaling if features requiring it are added.
*   **7.3. Usability**
    *   **NFR3.1:** Intuitiveness: The core suggestion workflow (type, pause, see suggestion, Tab to accept) MUST feel natural and require minimal learning, akin to GitHub Copilot.
    *   **NFR3.2:** Configuration Clarity: The options page MUST be easy to understand and navigate.
*   **7.4. Reliability / Availability**
    *   **NFR4.1:** Stability: The extension MUST be stable and not crash the browser tab or itself.
    *   **NFR4.2:** Graceful Degradation: If the AI API is unavailable or the user has no key, the extension should clearly indicate the issue and otherwise stay out of the way.
*   **7.5. Security**
    *   **NFR5.1:** API Key Security: The user's Gemini API key stored locally MUST use secure storage mechanisms (`chrome.storage.local`) and not be exposed unnecessarily.
    *   **NFR5.2:** Content Script Security: DOM manipulation by content scripts MUST be done carefully to avoid introducing cross-site scripting (XSS) vulnerabilities or breaking website functionality. Avoid `innerHTML` where possible; use `innerText` or `textContent` or safe DOM creation methods.
    *   **NFR5.3:** Backend Security (Future): If/when backend communication is implemented, it MUST use HTTPS, and appropriate authentication/authorization mechanisms must be employed.
*   **7.6. Accessibility**
    *   **NFR6.1:** Standard accessibility practices should be followed for the options page UI elements (e.g., proper labels, keyboard navigation). Inline suggestions might pose accessibility challenges; consider future improvements if possible (though difficult for this specific UI paradigm).

**8. UI/UX Requirements & Design**

*   **8.1. Wireframes / Mockups:** No specific wireframes provided. Adhere to the described interaction patterns.
*   **8.2. Key UI Elements:**
    *   **Inline Suggestion:** Faded/ghost text appearing directly after the cursor.
    *   **Popup Suggestion (Alternative):** Small, non-intrusive popup near the text cursor.
    *   **Sidebar Suggestion (Alternative):** A dedicated sidebar (potentially overlaying the page) displaying suggestions.
    *   **Extension Icon:** Standard browser extension icon, potentially with status indicators (e.g., error state).
    *   **Options Page:** Clean, standard HTML form layout for settings. Use default browser/OS UI elements for consistency.
*   **8.3. User Flow Diagrams:** (Conceptual)
    *   Typing -> Pause -> API Call -> Response -> Display Suggestion -> User Action (Tab/Type) -> Update Text/Dismiss Suggestion.
    *   Click Extension Icon -> Open Options Page -> Modify Settings -> Save Settings -> Settings Applied.

**9. Data Requirements**

*   **9.1. Data Model:**
    *   **Local Storage (`chrome.storage.local`):**
        *   `apiKey`: User's Gemini API Key (string, encrypted/obscured if possible, though `local` storage is sandboxed).
        *   `isEnabled`: Global toggle state (boolean).
        *   `blockedSites`: Array of strings (domain names).
        *   `suggestionDelay`: Time in ms (integer).
        *   `presentationMode`: Enum/string ('inline', 'popup', 'sidebar').
*   **9.2. Data Migration:** Not applicable for V1.
*   **9.3. Analytics & Tracking:** None required for V1 core functionality. Could be added later via backend for KPIs (opt-in).

**10. Release Criteria**

*   **10.1. Functional Criteria:** All functional requirements listed in Section 6 are implemented and verified. Core suggestion loop works reliably on common websites (Gmail, social media, forums). All settings options function correctly. Error handling behaves as specified.
*   **10.2. Non-Functional Criteria:** Performance is acceptable (no noticeable typing lag). Security review (manual check of key handling and DOM manipulation) passed. Extension is stable across multiple browser sessions.
*   **10.3. Testing Criteria:** Extension tested successfully on the latest stable version of Google Chrome. Key user scenarios (Section 4.2) executed without issues. Edge cases (invalid key, network down, blocked sites) tested. No console errors during normal operation. Frontend is error-free.
*   **10.4. Documentation Criteria:** Code includes clear comments for complex logic. `README.md` files in `extension/` and `backend/` provide setup instructions and overview.

**11. Open Issues / Future Considerations**

*   **11.1. Open Issues:** None at the start of development.
*   **11.2. Future Enhancements (Post-Launch):**
    *   Support for Firefox, Edge, and other browsers.
    *   More sophisticated context gathering (e.g., considering more surrounding text).
    *   Support for different AI models (OpenAI, Anthropic) via settings.
    *   User accounts and synchronization of settings (requires backend).
    *   Centralized API key proxying/management (requires backend).
    *   Opt-in anonymous telemetry for usage statistics (requires backend).
    *   Improved handling of complex rich text editors.
    *   Custom prompt templates or instructions.
    *   Investigate accessibility solutions for inline suggestions.

**12. Appendix & Glossary**

*   **12.1. Glossary:**
    *   **Inline Suggestion:** AI-generated text appearing directly in the text field, usually visually distinct (e.g., faded).
    *   **Content Script:** Extension script that runs in the context of a web page.
    *   **Options Page:** A page provided by the extension for user configuration.
    *   **Gemini:** Google's family of large language models.
*   **12.2. Related Documents:** N/A

**13. Document History / Revisions**

*   **Version 1.0 (2023-10-27):** Initial draft based on user requirements.

---

**Instructions for the AI Code Assistant:**

1.  **Target Platform:** Google Chrome Browser Extension (Manifest V3).
2.  **Project Structure:** Create two top-level folders: `extension/` (for all Chrome extension code - manifest.json, background scripts, content scripts, options page HTML/CSS/JS) and `backend/` (for Node.js/Express skeleton - basic server setup, placeholder routes, even if not fully utilized in V1).
3.  **Production Ready:** Generate code that is robust, well-structured, and suitable for a production release, not just a minimal MVP. Implement all features specified in the PRD.
4.  **Error Handling:** Implement comprehensive error handling as described (API errors, network issues, incompatible fields). Ensure the frontend UI is completely error-free during operation.
5.  **Performance:** Prioritize performance, especially minimizing typing latency. Use efficient event handling (debouncing), optimized DOM manipulation, and asynchronous operations correctly.
6.  **Security:** Adhere to security best practices for Chrome extensions, particularly regarding API key storage (`chrome.storage.local`) and secure interaction with web page content (avoid XSS vulnerabilities).
7.  **Code Quality & Documentation:** Generate clean, readable, and maintainable code. Include comments for complex logic sections (especially API calls, suggestion insertion, state management). Provide `README.md` files in both `extension/` and `backend/` folders outlining the structure, setup (including how to get/add the Gemini API key), and purpose of the code within.
8.  **Gemini Integration:** Use the following structure for Gemini API calls within the extension's JavaScript code:

    ```javascript
    // Ensure necessary imports or equivalent setup for browser environment
    // Note: The '@google/genai' library is typically for Node.js.
    // In a browser extension, you'll likely use fetch() with the REST API endpoint for Gemini.
    // The AI Agent needs to adapt this concept to the browser's fetch API.

    async function getGeminiSuggestion(apiKey, promptText) {
      // IMPORTANT: This is conceptual for the browser. Use the Gemini REST API endpoint.
      // Example endpoint structure (refer to official Gemini REST API docs):
      const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`; // Or the specific model like flash

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: promptText // The user's input context
              }]
            }],
            // Add generationConfig if needed (temperature, maxTokens etc.)
            // generationConfig: {
            //   temperature: 0.7,
            //   maxOutputTokens: 100,
            // }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Gemini API Error:', errorData);
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Safely access the text part. Structure might vary slightly based on model/response.
        // Check the actual response structure from the API.
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return suggestion.trim(); // Return the cleaned suggestion text

      } catch (error) {
        console.error('Failed to fetch Gemini suggestion:', error);
        // Handle the error appropriately in the extension UI
        return null; // Indicate failure
      }
    }

    // Example usage within the content script or background script:
    // const userApiKey = '...'; // Retrieved from chrome.storage.local
    // const currentTextContext = '...'; // Captured from the text field
    // const suggestion = await getGeminiSuggestion(userApiKey, currentTextContext);
    // if (suggestion) {
    //   // Display the suggestion
    // } else {
    //   // Handle error state
    // }
    ```
    *   **Note:** The AI agent must adapt the provided Node.js `@google/genai` code logic to use the Gemini **REST API** via the browser's `fetch` API, as libraries like `@google/genai` are not directly usable in browser extension content/background scripts. Ensure correct endpoint, API key handling, and request body structure according to Gemini REST API documentation.
9.  **Testing:** While the agent cannot perform real browser testing, the generated code should be logically sound and follow patterns that facilitate testing. Ensure all specified functionalities are implemented.


IMPORTANT: the ai agent should follow the below code for the gemini integration:

```javascript
// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
  });
  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-flash-preview-04-17';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
```