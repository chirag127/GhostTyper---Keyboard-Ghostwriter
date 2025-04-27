**GhostTyper - Product Requirements Document (PRD)**

**Document Version:** 1.0
**Last Updated:** 2023-10-27
**Owner:** Chirag Singhal
**Status:** Final
**Prepared for:** augment code assistant
**Prepared by:** Chirag Singhal (via CTO Assistant)

---

**1. Introduction & Overview**

*   **1.1. Purpose**
    This document outlines the product requirements for GhostTyper, a browser extension providing real-time AI writing suggestions. It serves as the primary blueprint for the AI code assistant tasked with developing the application, ensuring all features, technical specifications, and quality attributes are met for a production-ready release.

*   **1.2. Problem Statement**
    Users across various online platforms (email, social media, documents, etc.) lack a seamless, integrated tool that offers real-time AI-powered writing assistance directly within their text input fields. Existing solutions often require copy-pasting text into separate applications, disrupting workflow and reducing productivity.

*   **1.3. Vision / High-Level Solution**
    GhostTyper aims to be the "GitHub Copilot for everyday writing." It's a Google Chrome browser extension that monitors user typing in web forms and text areas. Upon pausing, it interfaces with a backend service (which uses the Google Gemini API via the user's provided key) to generate context-aware writing suggestions. These suggestions are displayed inline (or optionally via popup/panel) and can be accepted with a simple 'Tab' key press. The goal is to enhance user writing speed, confidence, creativity, and overcome writer's block through seamless, performant AI assistance.

**2. Goals & Objectives**

*   **2.1. Business Goals**
    *   Achieve significant user adoption within the target audience (Chrome users needing writing assistance).
    *   Establish GhostTyper as a leading, reliable, and highly-rated free AI writing assistant extension.
    *   Maintain high user satisfaction and positive reviews on the Chrome Web Store.

*   **2.2. Product Goals**
    *   Deliver real-time, accurate, and contextually relevant AI writing suggestions.
    *   Ensure an extremely performant and non-intrusive user experience (minimal typing lag).
    *   Provide users with clear configuration options for personalization (API key, site filtering, trigger delay, presentation mode).
    *   Implement robust security practices, especially regarding user API key handling.
    *   Create a stable, well-documented, and maintainable codebase suitable for a production-ready application.

*   **2.3. Success Metrics (KPIs)**
    *   **Active Users:** Number of Daily Active Users (DAU) and Weekly Active Users (WAU) (Requires basic, anonymous telemetry).
    *   **Suggestion Acceptance Rate:** Percentage of displayed suggestions accepted via 'Tab' key (Requires basic, anonymous telemetry).
    *   **User Ratings & Reviews:** Average rating and qualitative feedback on the Chrome Web Store.
    *   **Installation Growth:** Number of installs over time.

**3. Scope**

*   **3.1. In Scope (Production Release)**
    *   **Browser Extension (Frontend):** Google Chrome only.
    *   **Core Functionality:** Detect typing in most standard HTML text input fields (`<input type="text">`, `<textarea>`) and `contenteditable` elements. Trigger suggestion generation after a configurable pause in typing. Display AI suggestions. Accept suggestion via 'Tab' key.
    *   **AI Integration:** Integrate with Google Gemini API via a dedicated backend service. Use the specific Node.js code provided for Gemini streaming interaction.
    *   **Backend Service (Proxy/Processor):** Node.js/Express backend. Receives text context and user's Gemini API key from the extension. Calls the Gemini API using the provided key. Streams the response back to the extension. **Crucially, the backend MUST NOT store the user's API key.** It uses it ephemerally per request.
    *   **API Key Management:** Secure input and storage of the user's Gemini API key within the extension's local storage (`chrome.storage.local`). Secure transmission (HTTPS) of the key to the backend only when requesting suggestions.
    *   **Suggestion Presentation:** Default: Inline, grayed-out text. User-configurable options: Small popup near cursor, Dedicated side panel.
    *   **Configuration Options (Extension Settings Page):**
        *   Enter/Update Gemini API Key.
        *   Global Enable/Disable toggle for the extension.
        *   Site List: Allow/Block specific websites/domains for GhostTyper activation.
        *   Adjust suggestion trigger delay (milliseconds, default 500ms).
        *   Select suggestion presentation mode (Inline, Popup, Panel).
        *   Button to clear stored API key and related local data.
    *   **Error Handling:** Graceful handling and user feedback for: Invalid/Expired API Key, Gemini API errors/timeouts, Backend connectivity issues, Incompatible input fields (silent disable).
    *   **Performance:** Optimize for minimal latency and resource usage.
    *   **Security:** HTTPS for backend communication, secure local storage, protection against XSS via DOM manipulation, backend input validation and basic rate limiting (TBD).
    *   **Documentation:** Comprehensive `README.md` files (root, `extension/`, `backend/`), inline code comments for complex logic, setup/configuration instructions.
    *   **Project Structure:** Adhere strictly to `extension/` for frontend and `backend/` for backend code.

*   **3.2. Out of Scope (For this version)**
    *   Support for other browsers (Firefox, Edge, Safari, etc.).
    *   Support for other AI models (OpenAI, Anthropic, etc.).
    *   User accounts, authentication, or server-side storage of API keys.
    *   Advanced features like custom prompt engineering, tone/style selection, document-level context awareness.
    *   Offline functionality.
    *   Mobile or desktop application versions.
    *   Monetization features (Subscription, Premium tiers).
    *   Detailed analytics dashboard beyond basic KPIs.
    *   Collaborative features.
    *   Formal accessibility audit (though basic best practices should be followed).

**4. User Personas & Scenarios**

*   **4.1. Primary Persona(s)**
    *   **Alex the Blogger:** Writes articles frequently, needs help with phrasing, idea generation, and overcoming writer's block quickly within their CMS.
    *   **Sam the Student:** Writes essays, emails professors, participates in online forums. Needs help with clarity, grammar, and generating text efficiently.
    *   **Maria the Marketer:** Crafts social media posts, emails, ad copy. Needs concise, engaging text suggestions directly within various web platforms.
    *   **Dev the Developer:** Writes documentation, commit messages, emails, forum responses. Needs quick suggestions for technical writing and communication.

*   **4.2. Key User Scenarios / Use Cases**
    *   **First Use & Setup:** User installs GhostTyper -> Opens options -> Enters their Gemini API Key -> Saves settings.
    *   **Getting Suggestions:** User types in a supported text field (e.g., Gmail compose window) -> Pauses typing -> GhostTyper backend is called -> Inline suggestion appears -> User presses 'Tab' to accept -> Suggestion becomes part of the text.
    *   **Ignoring Suggestions:** User sees a suggestion -> Continues typing -> Suggestion disappears.
    *   **Changing Settings:** User opens options -> Changes trigger delay -> Disables GhostTyper on `example.com` -> Changes presentation to 'Popup'.
    *   **Handling API Key Error:** User enters invalid key -> Tries typing -> Sees an error indicator on extension icon -> Opens options, sees error message -> Enters correct key.
    *   **Handling AI Service Error:** Gemini API is temporarily unavailable -> User pauses typing -> GhostTyper shows a loading/error state -> Recovers when service is back.

**5. User Stories**

*   **US1:** As a user, I want to install a Chrome extension that provides AI writing suggestions inline as I type, so I can improve my writing without leaving my current webpage.
*   **US2:** As a user, I want to securely enter my Google Gemini API key in the extension settings, so GhostTyper can generate suggestions using my account.
*   **US3:** As a user, I want suggestions to appear automatically after I pause typing for a brief, configurable period, so the experience feels seamless.
*   **US4:** As a user, I want to accept a suggestion simply by pressing the 'Tab' key, so I can integrate suggestions quickly into my text.
*   **US5:** As a user, I want to control where GhostTyper is active using an allow/block list for websites, so it doesn't interfere unnecessarily.
*   **US6:** As a user, I want to choose how suggestions are displayed (inline, popup, or side panel) to match my preference.
*   **US7:** As a user, I want clear feedback if my API key is invalid or if the AI service encounters an error, so I can troubleshoot the issue.
*   **US8:** As a user (and developer), I want the backend service to handle my API key securely, using it only for processing and not storing it, to protect my credentials.
*   **US9:** As a user, I want the extension to feel extremely fast and responsive, with no noticeable typing lag.

**6. Functional Requirements (FR)**

*   **6.1. Extension Core Logic**
    *   **FR1.1:** The extension MUST detect user input in standard text fields (`<input type="text">`, `<textarea>`) and `contenteditable` elements across web pages.
    *   **FR1.2:** The extension MUST monitor typing activity and trigger a suggestion request after the user pauses for a configurable duration (default 500ms). Use debouncing to prevent excessive triggers.
    *   **FR1.3:** The extension MUST capture sufficient preceding text context to send to the backend for relevant suggestions.
    *   **FR1.4:** The extension MUST send the context and the user's stored API key securely (HTTPS) to the designated backend endpoint.
    *   **FR1.5:** The extension MUST receive the streamed suggestion response from the backend.
    *   **FR1.6:** The extension MUST display the incoming suggestion according to the user's chosen presentation mode (Inline default, Popup, Panel). Inline suggestions should be visually distinct (e.g., grayed-out).
    *   **FR1.7:** The extension MUST listen for the 'Tab' key press when a suggestion is displayed. If pressed, the suggestion text MUST be inserted/committed into the text field, replacing the suggestion UI.
    *   **FR1.8:** If the user continues typing or moves the cursor significantly while a suggestion is displayed, the suggestion MUST be dismissed.
    *   **FR1.9:** The extension MUST NOT activate or attempt suggestions in password fields (`<input type="password">`) or potentially other sensitive/incompatible fields.
    *   **FR1.10:** Implement basic, anonymous telemetry to track suggestion display counts and acceptance counts (Tab presses) for KPI measurement. Send this data periodically to a dedicated backend endpoint. Ensure no PII or actual typed text is sent.

*   **6.2. Backend Service (Node.js/Express)**
    *   **FR2.1:** The backend MUST provide an HTTPS API endpoint to receive suggestion requests from the extension.
    *   **FR2.2:** The request payload MUST include the text context and the user's Gemini API key.
    *   **FR2.3:** The backend MUST validate incoming requests (e.g., presence of context and key).
    *   **FR2.4:** The backend MUST use the provided Gemini API key to call the Google Gemini API (model: `gemini-1.5-flash-preview-0514`, using the provided streaming code snippet).
    *   **FR2.5:** The backend MUST **NEVER** store or log the user's Gemini API key. It must only be held in memory for the duration of the API call.
    *   **FR2.6:** The backend MUST stream the text response from the Gemini API back to the requesting extension client in real-time.
    *   **FR2.7:** The backend MUST handle potential errors from the Gemini API (e.g., rate limits, invalid key, service errors) and relay appropriate error information back to the extension.
    *   **FR2.8:** The backend MUST include basic security measures like input sanitization and potentially rate limiting per IP or another identifier if abuse becomes likely (though user-provided keys mitigate this somewhat).
    *   **FR2.9:** Provide a separate, simple endpoint to receive anonymous telemetry data (suggestion shown count, suggestion accepted count). Store this aggregated data minimally (e.g., daily counts).

*   **6.3. Extension Settings & UI**
    *   **FR3.1:** Provide a standard browser action (extension icon) in the Chrome toolbar. Clicking it could show status or open options.
    *   **FR3.2:** Provide an Options page accessible via the extension icon or `chrome://extensions`.
    *   **FR3.3:** The Options page MUST include an input field for the Gemini API Key. The key MUST be saved securely using `chrome.storage.local`.
    *   **FR3.4:** The Options page MUST include a global toggle switch (On/Off) for enabling/disabling GhostTyper entirely.
    *   **FR3.5:** The Options page MUST allow users to manage a list of websites (domains or URL patterns) where GhostTyper should be disabled (block list) or exclusively enabled (allow list - choose one approach, block list is often simpler).
    *   **FR3.6:** The Options page MUST include a numeric input or slider to configure the suggestion trigger delay (in milliseconds).
    *   **FR3.7:** The Options page MUST include radio buttons or a dropdown to select the suggestion presentation mode (Inline, Popup, Panel).
    *   **FR3.8:** The Options page MUST include a button to clear the stored API key and any other locally stored GhostTyper data.
    *   **FR3.9:** The Options page MUST display clear error messages if the API key is detected as invalid or if there are persistent backend connectivity issues.
    *   **FR3.10:** The extension icon MAY display a badge or change color to indicate status (e.g., active, error).

*   **6.4. Error Handling Logic**
    *   **FR4.1:** If the backend reports an invalid API key, disable suggestions and show a persistent error state (icon badge + options message) until a valid key is entered.
    *   **FR4.2:** If the Gemini API call fails or times out (e.g., > 8 seconds), show a temporary error indicator near the typing area or via the extension icon, and potentially retry once.
    *   **FR4.3:** If the backend service is unreachable, show a distinct error state indicating a connection problem with the GhostTyper service.
    *   **FR4.4:** If the extension detects an incompatible input field, it MUST silently disable itself for that field without user notification to avoid annoyance.

**7. Non-Functional Requirements (NFR)**

*   **7.1. Performance**
    *   **NFR1.1:** Suggestion Latency: The time from user pausing typing to suggestion appearing should feel near-instantaneous, ideally under 500ms network/AI time permitting. Perceived lag must be minimized. **(Extremely Critical)**
    *   **NFR1.2:** Resource Usage: The extension's impact on browser CPU and memory usage must be minimal during both active use and idle states.
    *   **NFR1.3:** Backend Response Time: The backend processing time (excluding the AI call itself) must be negligible (<50ms).
*   **7.2. Scalability**
    *   **NFR2.1:** Backend: The backend must be stateless regarding user data/API keys to allow for easy horizontal scaling if needed (though load is distributed by user keys). It should handle a reasonable number of concurrent connections efficiently.
*   **7.3. Usability**
    *   **NFR3.1:** Setup: Entering the API key and configuring basic settings must be intuitive.
    *   **NFR3.2:** Interaction: The core suggestion loop (pause, see, Tab) must feel fluid and natural.
    *   **NFR3.3:** Feedback: Error states and configuration options must be clear and understandable.
*   **7.4. Reliability / Availability**
    *   **NFR4.1:** Extension Stability: The extension must not crash or cause browser instability.
    *   **NFR4.2:** Backend Availability: The backend service should target high availability (e.g., 99.9% uptime, dependent on hosting).
    *   **NFR4.3:** Graceful Degradation: The extension should handle backend/AI outages gracefully, informing the user without breaking website functionality.
*   **7.5. Security**
    *   **NFR5.1:** API Key Storage: User's API key must be stored using `chrome.storage.local`. While not perfectly secure, it's the standard mechanism. Do not store it in `chrome.storage.sync`.
    *   **NFR5.2:** API Key Transmission: API key MUST only be sent over HTTPS to the backend.
    *   **NFR5.3:** Backend Security: The backend MUST NOT store or log API keys. Implement basic input validation and security headers. Protect against common web vulnerabilities (OWASP Top 10 relevant items).
    *   **NFR5.4:** DOM Interaction: Carefully sanitize any data written back into the page DOM (e.g., suggestions) to prevent XSS vulnerabilities. Avoid overly broad DOM manipulation.
*   **7.6. Accessibility**
    *   **NFR6.1:** Options Page: Ensure the options page follows basic accessibility guidelines (keyboard navigation, semantic HTML, sufficient color contrast). (Note: Inline suggestion accessibility for screen readers is a known challenge and out of scope for deep implementation in v1).
*   **7.7. Maintainability**
    *   **NFR7.1:** Code Quality: Code must be clean, well-organized (following the `extension/`, `backend/` structure), and follow standard JavaScript/Node.js best practices (use linters/formatters like ESLint/Prettier).
    *   **NFR7.2:** Documentation: Provide comprehensive READMEs and code comments as specified in FR15.
    *   **NFR7.3:** Configuration: Backend should be configurable via environment variables (port, potentially API endpoints).

**8. UI/UX Requirements & Design**

*   **8.1. Wireframes / Mockups**
    *   No formal wireframes provided. Implement using standard web elements and patterns.
    *   Inline Suggestion: Mimic GitHub Copilot style (faded text appended to cursor).
    *   Popup Suggestion: Simple, non-modal floating box near the cursor.
    *   Panel Suggestion: A simple side panel overlay (implementation TBD, ensure it doesn't break site layouts).
    *   Options Page: Standard Chrome extension options page layout with clear sections for settings.
*   **8.2. Key UI Elements**
    *   Extension Icon (Toolbar) + Optional Badge for Status/Errors.
    *   Inline Suggestion Text (grayed-out).
    *   Popup Suggestion Box.
    *   Side Panel UI.
    *   Options Page: Input fields, toggles, lists, buttons.
    *   Error messages/indicators.
*   **8.3. User Flow Diagrams**
    *   (Refer to Scenarios in 4.2 for core user flows).

**9. Data Requirements**

*   **9.1. Data Model**
    *   **Extension (`chrome.storage.local`):**
        *   `apiKey`: String (User's Gemini API Key)
        *   `isEnabled`: Boolean (Global toggle state)
        *   `siteList`: Array<String> (List of blocked/allowed domain patterns)
        *   `triggerDelay`: Number (Delay in ms)
        *   `presentationMode`: String ('inline' | 'popup' | 'panel')
    *   **Backend (In-memory / Ephemeral per request):**
        *   Text context (String)
        *   API Key (String) - *NOT STORED PERSISTENTLY*
    *   **Backend (Minimal Persistent Store for Telemetry - e.g., simple DB or file):**
        *   `dailyMetrics`: { date: String, suggestionsShown: Number, suggestionsAccepted: Number } (Aggregated, anonymous)
*   **9.2. Data Migration**
    *   N/A for v1.0.
*   **9.3. Analytics & Tracking**
    *   Implement basic, anonymous aggregation of suggestion shown/accepted counts via the backend telemetry endpoint (FR2.9, FR1.10). No user-identifiable data or typed content beyond counts.

**10. Release Criteria**

*   **10.1. Functional Criteria:** All Functional Requirements (Section 6) implemented and tested successfully in the latest stable version of Google Chrome. All user scenarios (Section 4.2) are functional.
*   **10.2. Non-Functional Criteria:** Performance targets (NFR1.1) met based on subjective testing (feels instant). Security measures (NFR7.5) implemented. Code is well-documented and maintainable (NFR7.7, NFR7.2).
*   **10.3. Testing Criteria:** Successful manual testing across a variety of websites (Gmail, Google Docs basic, Reddit, simple textareas). No critical bugs or regressions found. Extension does not generate console errors. Backend handles requests reliably. Error handling behaves as specified.
*   **10.4. Documentation Criteria:** All required `README.md` files and code comments are present and accurate. Setup instructions are clear and complete for both extension and backend.

**11. Open Issues / Future Considerations**

*   **11.1. Open Issues (During Development)**
    *   Determine optimal strategy for identifying compatible input fields reliably across diverse websites.
    *   Refine specific error messages and user feedback mechanisms.
    *   Establish specific backend rate-limiting strategy if needed.
    *   Accessibility limitations of inline suggestions for screen reader users.
*   **11.2. Future Enhancements (Post-Launch)**
    *   Support for Firefox and other browsers.
    *   Support for alternative AI models (OpenAI, Anthropic).
    *   User accounts for easier key management or potential premium features.
    *   Advanced settings (custom prompts, model selection, tone/style).
    *   More robust handling of complex web editors/SPAs.
    *   Telemetry opt-out mechanism.
    *   Improved accessibility features.

**12. Appendix & Glossary**

*   **12.1. Glossary**
    *   **Inline Suggestion:** AI suggestion displayed directly within the text field, appearing as faded text after the cursor.
    *   **Debounce:** Programming practice to limit the rate at which a function is called (e.g., triggering AI request only after typing pauses).
    *   **`chrome.storage.local`:** Browser API for extensions to store data locally on the user's machine, not synced across devices.
    *   **Stateless Backend:** Backend design where no client session data is stored on the server between requests. Each request contains all necessary information.
    *   **Telemetry:** Collection of basic, anonymous usage data for understanding product performance and user behavior (e.g., acceptance rate).
    *   **XSS (Cross-Site Scripting):** Security vulnerability allowing attackers to inject malicious scripts into web pages viewed by other users.
*   **12.2. Related Documents**
    *   Google Gemini API Documentation: [Link to relevant Gemini docs]
    *   Chrome Extension Development Guide: [Link to Chrome Dev docs]

**13. Document History / Revisions**

| Version | Date       | Author      | Changes                                      |
| :------ | :--------- | :---------- | :------------------------------------------- |
| 1.0     | 2023-10-27 | CTO Assistant | Initial draft based on user requirements. |

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