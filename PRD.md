
**GhostTyper - Product Requirements Document (PRD)**

**Document Version:** 1.0
**Last Updated:** 2025-05-20
**Owner:** User (Developer)
**Status:** Final
**Prepared for:** AI Code Assistant
**Prepared by:** Friendly CTO AI

---

**Instructions for the AI Code Assistant:**

*   **Goal:** Build the GhostTyper browser extension based *solely* on this PRD.
*   **Technology:** Use **HTML, CSS, and JavaScript** within the **Manifest V3** framework for browser extensions.
*   **Project Structure:** Place all extension code within a root folder named `extension/`. Maintain a clean, logical structure within this folder (e.g., separate files for content scripts, background service worker, popup logic, CSS, utility functions).
*   **Quality:** Deliver a **complete and production-ready** solution (not an MVP). The code must be:
    *   Well-documented (comments explaining complex logic, function purposes).
    *   Following modern JavaScript best practices (e.g., ES6+, async/await).
    *   Easy to maintain and understand.
    *   Fully functional as per the requirements below.
    *   Thoroughly tested (consider edge cases like empty fields, rapid typing, API errors).
    *   Ensure the frontend logic (content scripts, popup) is robust and error-free.
*   **Gemini Integration:** Implement the Google Gemini integration using the JavaScript approach detailed in **Section 6.3** and handle the streaming response appropriately for inline display.
*   **No Backend:** This is a client-side only extension. All logic runs within the browser extension context. User provides their own API key.

---

**1. Introduction & Overview**

*   **1.1. Purpose:** This document outlines the requirements for "GhostTyper," a browser extension designed to provide real-time, inline AI-powered writing suggestions to users as they type in web forms and text fields.
*   **1.2. Problem Statement:** Users often face writer's block, struggle with phrasing, or simply want to write faster online (emails, social media, forms, etc.). Existing tools may require copy-pasting or switching contexts.
*   **1.3. Vision / High-Level Solution:** GhostTyper acts like an "everyday Copilot," integrating seamlessly into the user's workflow. It monitors typing in text fields, sends context to the Google Gemini API (using the user's key), and displays suggestions inline, which can be accepted with a simple action (Tab or click).

**2. Goals & Objectives**

*   **2.1. Business Goals:**
    *   Achieve user adoption within the target browser ecosystems.
    *   Provide a valuable tool that users find indispensable for online writing tasks.
*   **2.2. Product Goals:**
    *   Provide timely and relevant writing suggestions with minimal latency.
    *   Offer a seamless and intuitive user experience for triggering, viewing, accepting, and dismissing suggestions.
    *   Ensure user control over the extension's activation and API key management.
    *   Maintain high performance and avoid negatively impacting browser responsiveness.
*   **2.3. Success Metrics (KPIs):**
    *   Number of active weekly users.
    *   Frequency of suggestion acceptance (Tab presses / Clicks on suggestion).
    *   User ratings and reviews in browser extension stores.
    *   Qualitative user feedback indicating improved writing speed/quality or reduced effort.

**3. Scope**

*   **3.1. In Scope:**
    *   Core suggestion functionality (triggering, inline display, acceptance, dismissal).
    *   Integration with Google Gemini API using user-provided keys (streaming response handling).
    *   Extension popup for settings:
        *   API Key input and storage (`chrome.storage.sync`).
        *   Global Enable/Disable toggle.
        *   Website blacklist configuration (simple URL list).
    *   Automatic disabling on password fields (`<input type="password">`).
    *   Support for standard HTML `<input type="text">` and `<textarea>` elements.
    *   Compatibility with Chrome, Firefox, Edge, and other Chromium-based browsers (Manifest V3).
    *   Basic error handling and performance optimization (debouncing, async calls).
*   **3.2. Out of Scope:**
    *   Backend infrastructure (user provides own API key).
    *   Support for non-English languages.
    *   Suggestions involving complex formatting (bold, italics, lists).
    *   Deep integration with specific rich text editors or web applications (e.g., Google Docs, Notion). Initial support focuses on standard text fields.
    *   Advanced AI configuration options (e.g., selecting different models, adjusting temperature/creativity).
    *   Website whitelist functionality (only blacklist is required).
    *   Analytics collection (beyond basic extension store metrics).

**4. User Personas & Scenarios**

*   **4.1. Primary Persona(s):**
    *   **Frequent Web Writer (e.g., Social Media Manager, Blogger, Support Agent, Student):** Spends significant time writing content directly in web interfaces (social media posts, blog comments, emails, forum responses, knowledge base articles). Values speed, clarity, and overcoming writer's block.
*   **4.2. Key User Scenarios / Use Cases:**
    *   **Writing an Email:** User starts typing an email in Gmail/Outlook Web. GhostTyper suggests sentence completions or alternative phrasing inline. User presses Tab to accept a useful suggestion.
    *   **Filling a Form:** User fills out a feedback form with a long text description. GhostTyper helps elaborate points or structure the feedback.
    *   **Social Media Posting:** User drafts a post on Twitter/LinkedIn/Facebook. GhostTyper suggests relevant continuations or rephrasing. User continues typing to ignore a suggestion.
    *   **Configuration:** User installs the extension, clicks the icon, pastes their Gemini API key into the popup, and saves it. Later, they add a specific website to the blacklist via the popup.

**5. User Stories**

*   **US1:** As a Frequent Web Writer, I want to see writing suggestions appear automatically and inline as I type, so I can write faster without interrupting my flow.
*   **US2:** As a user, I want to accept a suggestion by pressing the Tab key or clicking on the suggestion text, so I can easily incorporate helpful suggestions.
*   **US3:** As a user, I want to ignore a suggestion by simply continuing to type or pressing the Escape key, so suggestions don't block me when not needed.
*   **US4:** As a user, I need to provide my own Google Gemini API key via the extension's settings popup, so the extension can generate suggestions using my account.
*   **US5:** As a user, I want to globally enable or disable the extension easily via the popup, so I have full control over when it's active.
*   **US6:** As a user, I want to prevent the extension from activating on specific websites (e.g., internal tools, banking sites) by adding them to a blacklist in the settings, so I can control where suggestions appear.
*   **US7:** As a user, I expect the extension not to offer suggestions in password fields, ensuring my sensitive information remains private.

**6. Functional Requirements (FR)**

*   **6.1. Suggestion Generation & Display**
    *   **FR1.1:** The extension's content script MUST monitor user input in active `<input type="text">` and `<textarea>` elements.
    *   **FR1.2:** Suggestions MUST NOT be triggered for elements of type `<input type="password">`.
    *   **FR1.3:** When the user pauses typing for a defined duration (approx. 500ms, configurable internally via debounce), the extension MUST trigger an AI suggestion request if globally enabled and the current site is not blacklisted.
    *   **FR1.4:** The suggestion request MUST send the *entire current content* of the focused text field as context to the configured Google Gemini API endpoint.
    *   **FR1.5:** The extension MUST handle the *streaming response* from the Gemini API.
    *   **FR1.6:** The incoming suggestion text (potentially updating via stream) MUST be displayed directly inline with the user's cursor, visually distinct (e.g., greyed-out text), but matching the approximate size/font of the surrounding text.
    *   **FR1.7:** The inline suggestion MUST be rendered as an element that can be clicked (see FR2.2).
    *   **FR1.8:** A subtle loading indicator SHOULD appear near the cursor or input field if the API response takes longer than ~1 second.
*   **6.2. Suggestion Interaction**
    *   **FR2.1:** Pressing the **Tab** key while a suggestion is visible MUST accept the suggestion, replacing the suggestion text with normal text and placing the cursor at the end. The default Tab behavior (changing focus) should be prevented in this case.
    *   **FR2.2:** **Clicking** directly on the displayed inline suggestion text MUST also accept the suggestion (same outcome as FR2.1).
    *   **FR2.3:** Pressing the **Escape** key while a suggestion is visible MUST dismiss the current suggestion without accepting it.
    *   **FR2.4:** Typing any character while a suggestion is visible MUST dismiss the current suggestion and allow the typed character to proceed as normal.
*   **6.3. AI Integration (Google Gemini)**
    *   **FR3.1:** The extension MUST use the Google Gemini API (`@google/genai` library or direct `fetch` calls if library usage is complex in extensions) to generate text suggestions.
    *   **FR3.2:** Use the `gemini-2.5-flash-preview-04-17` model (or allow easy configuration if needed later).
    *   **FR3.3:** Use the following structure/logic for the API call (adapt as needed for background script/API key injection and streaming response handling):
        ```javascript
        // Placeholder logic - adapt for extension environment (background script, content script communication, API key retrieval)
        // Ensure to handle streaming responses chunk by chunk for inline display updates.
        // Need to import necessary libraries (@google/genai or use fetch)

        async function getGeminiSuggestion(apiKey, inputText) {
          // Ensure apiKey is correctly passed and used for authentication
          // Example: const ai = new GoogleGenerativeAI(apiKey);
          // Handle potential errors during initialization or API call

          const model = 'gemini-2.5-flash-preview-04-17'; // Check correct model ID
          const config = {
            // Adjust configuration as needed - e.g., safetySettings, generationConfig
            // responseMimeType might not be applicable depending on SDK/fetch usage
          };
          const contents = [{
            role: 'user',
            parts: [{ text: inputText }],
          }];

          try {
            // Use the appropriate method for streaming generation
            // Example: const responseStream = await ai.getGenerativeModel({ model }).generateContentStream({ contents, config });
            // Process the stream: Concatenate text chunks and send updates to the content script for display.
            let fullResponse = '';
            // for await (const chunk of responseStream) {
            //   if (chunk.text) {
            //      fullResponse += chunk.text(); // Adapt based on actual SDK response structure
            //      // Send incremental updates to content script to update inline suggestion
            //   }
            // }
            // return fullResponse; // Or handle streaming directly in content script if feasible

            // Placeholder return for non-streaming example / simplified version
            // const result = await model.generateContent({ contents, config });
            // const response = await result.response;
            // return response.text();

            // **Crucial:** Replace above with actual streaming implementation
            console.log("Streaming implementation required here.");
            return "Example suggestion based on: " + inputText.slice(-50); // Placeholder

          } catch (error) {
            console.error("Gemini API Error:", error);
            // Handle different error types (invalid key, network, quota)
            return null; // Indicate failure
          }
        }
        ```
    *   **FR3.4:** API calls MUST be asynchronous and MUST NOT block the user interface or typing responsiveness.
    *   **FR3.5:** Implement debouncing/throttling on the trigger mechanism (FR1.3) to avoid excessive API calls during rapid typing.
*   **6.4. Settings & Configuration**
    *   **FR4.1:** Clicking the extension icon in the browser toolbar MUST open a popup window.
    *   **FR4.2:** The popup MUST contain an input field for the user to enter their Google Gemini API Key.
    *   **FR4.3:** The popup MUST contain a button or mechanism to save the entered API Key.
    *   **FR4.4:** The API Key MUST be securely stored using `chrome.storage.sync`.
    *   **FR4.5:** The popup MUST contain a toggle switch (or checkbox) to globally enable or disable the GhostTyper extension's suggestion functionality. The state MUST persist.
    *   **FR4.6:** The popup MUST contain a textarea field allowing users to enter website hostnames (e.g., `example.com`, one per line) to blacklist. Suggestions MUST be disabled on pages matching these hostnames.
    *   **FR4.7:** The blacklist MUST be saved and persist using `chrome.storage.sync`. The content script must check against this list before triggering suggestions.
    *   **FR4.8:** The popup UI should be clean, simple, and intuitive.
*   **6.5. Error Handling**
    *   **FR5.1:** If an API call fails (e.g., invalid key, network error, Gemini service error), the failure MUST be handled gracefully. No suggestion should appear.
    *   **FR5.2:** Repeated API failures SHOULD result in a small, non-intrusive visual indicator (e.g., an error icon near the text field or extension icon) to alert the user.
    *   **FR5.3:** Detailed error information MUST be logged to the browser's developer console (background script console and potentially content script console) for debugging purposes.

**7. Non-Functional Requirements (NFR)**

*   **7.1. Performance:**
    *   **NFR1.1:** Suggestion triggering and display should feel near real-time (< 1-second latency preferred for API roundtrip + display).
    *   **NFR1.2:** The extension MUST have minimal impact on browser performance and page loading times. CPU and memory usage should be optimized.
    *   **NFR1.3:** Content script operations (monitoring typing, DOM manipulation) must be highly efficient.
*   **7.2. Scalability:**
    *   **NFR2.1:** The extension is client-side only; scalability primarily relates to handling potentially large text inputs efficiently and managing API calls responsibly (via debouncing).
    *   **NFR2.2:** Consider potential `chrome.storage.sync` limits (QUOTA_BYTES_PER_ITEM, MAX_ITEMS, TOTAL_BYTES) if the blacklist becomes extremely large, although unlikely for typical use.
*   **7.3. Usability:**
    *   **NFR3.1:** The inline suggestion should be easy to read and differentiate from the user's typed text but visually unobtrusive.
    *   **NFR3.2:** Interaction (accept/dismiss) must be intuitive and align with common patterns (Tab for completion).
    *   **NFR3.3:** The settings popup must be easy to understand and use.
*   **7.4. Reliability / Availability:**
    *   **NFR4.1:** The extension should function reliably across different websites and sessions.
    *   **NFR4.2:** Graceful degradation in case of API errors or unsupported fields.
*   **7.5. Security:**
    *   **NFR5.1:** User's API key must be stored securely (`chrome.storage.sync` as chosen, though `local` is often recommended for sensitive data - proceed with `sync` per user choice).
    *   **NFR5.2:** The extension MUST NOT inject suggestions into password fields.
    *   **NFR5.3:** Adhere to Manifest V3 security policies (e.g., avoid `eval`, restrictive Content Security Policy).
    *   **NFR5.4:** API calls to Gemini should be made securely (HTTPS).
*   **7.6. Accessibility:**
    *   **NFR6.1:** Popup UI elements (buttons, inputs, toggles) should be keyboard accessible and have appropriate labels for screen readers (basic accessibility compliance).
    *   **NFR6.2:** Consider if inline suggestions interfere with screen reader output (potential challenge - initial focus on visual implementation).

**8. UI/UX Requirements & Design**

*   **8.1. Wireframes / Mockups:**
    *   **Popup:** A simple vertical layout:
        *   Title: "GhostTyper Settings"
        *   Label: "Google Gemini API Key" + Input Field [_______] + Save Button
        *   Toggle Switch: "Enable GhostTyper" [ON/OFF]
        *   Label: "Blacklisted Sites (one per line, e.g., example.com)" + Textarea [_______]
    *   **Inline Suggestion:** Display as greyed-out text appended directly after the user's cursor within the text field/area. Font size should attempt to match the field's computed style where feasible. The suggestion text itself should be clickable.
*   **8.2. Key UI Elements:**
    *   Extension Toolbar Icon (Standard puzzle piece or custom icon).
    *   Settings Popup window.
    *   Inline suggestion text element (dynamically created and positioned).
    *   Subtle loading indicator (optional, if API is slow).
    *   Non-intrusive error indicator (optional, on repeated API failures).
*   **8.3. User Flow Diagrams:**
    *   **Suggestion Flow:** User Types -> Pause Detected (Debounced) -> Check Enabled & Not Blacklisted -> Get Text Field Content -> Send to Gemini API (Async) -> Receive Streaming Response -> Render/Update Inline Suggestion -> User Presses Tab/Clicks (Accept) OR User Types/Esc (Dismiss).
    *   **Settings Flow:** User Clicks Extension Icon -> Popup Opens -> User Enters/Modifies API Key -> Clicks Save -> Key Stored in `chrome.storage.sync`. -> User Toggles Enable Switch -> State Stored. -> User Adds/Removes Site from Blacklist Textarea -> Changes Stored.

**9. Data Requirements**

*   **9.1. Data Model:**
    *   Stored in `chrome.storage.sync`:
        *   `geminiApiKey`: User's Google Gemini API Key (string).
        *   `isGloballyEnabled`: Boolean flag for the master toggle (true/false).
        *   `blacklist`: Array of strings (hostnames) or a single newline-delimited string.
*   **9.2. Data Migration:** Not applicable for V1.
*   **9.3. Analytics & Tracking:** None in V1.

**10. Release Criteria**

*   **10.1. Functional Criteria:** All Functional Requirements (Section 6) are implemented and verified.
*   **10.2. Non-Functional Criteria:** Performance (NFR1.1, NFR1.2), Security (NFR5.1, NFR5.2), Reliability goals met through testing.
*   **10.3. Testing Criteria:**
    *   Works correctly in latest versions of Chrome, Firefox, Edge.
    *   Handles various text field types and common websites.
    *   Handles edge cases: empty fields, very long text, rapid typing/deleting, invalid API key, network offline, Gemini API errors.
    *   Settings persistence and blacklist functionality verified.
    *   No console errors during normal operation.
*   **10.4. Documentation Criteria:** Code is well-commented. A basic README explains installation and setup (including getting a Gemini key).

**11. Open Issues / Future Considerations**

*   **11.1. Open Issues:**
    *   Compatibility with complex Rich Text Editors (e.g., Quill, Slate, CKEditor) might be limited initially. Focus on standard `<input>`/`<textarea>`.
    *   Click-to-accept implementation requires careful handling of event propagation and DOM structure.
    *   Precisely matching inline suggestion style to arbitrary website styles can be challenging; aim for a good generic style.
*   **11.2. Future Enhancements (Post-Launch):**
    *   Whitelist functionality (complementary to blacklist).
    *   Allowing users to choose different AI models or providers.
    *   More sophisticated context gathering (e.g., previous sentences, page content).
    *   Support for multiple languages.
    *   Adjustable suggestion trigger delay/sensitivity.
    *   Improved handling of Rich Text Editors.
    *   Basic usage analytics (opt-in).
    *   Consider `chrome.storage.local` for API key if sync security is a concern.

**12. Appendix & Glossary**

*   **12.1. Glossary:**
    *   **Inline Suggestion:** AI-generated text appearing directly within the text field at the cursor position.
    *   **Debouncing:** Programming practice to ensure that time-consuming tasks do not fire so often, limiting the rate at which a function gets called.
    *   **Manifest V3:** The current standard for Chrome extension development, emphasizing security and performance.
    *   **Content Script:** Extension script running in the context of a web page.
    *   **Background Script (Service Worker in MV3):** Extension script running in the background, handling events and core logic.
    *   **Popup:** Small window appearing when the extension's toolbar icon is clicked.
*   **12.2. Related Documents:** N/A

**13. Document History / Revisions**

*   **Version 1.0 (2024-05-20):** Initial draft based on developer requirements gathering.

---

**Final Check for AI Code Assistant:**

*   Please ensure all functional requirements (FR) and non-functional requirements (NFR) are met.
*   Pay close attention to the specified **Technology Stack** (MV3, JS/HTML/CSS), **Project Structure**, **Gemini Integration details (FR3.3, streaming)**, **API Key Handling (`chrome.storage.sync`)**, and **Error Handling (FR5.x)**.
*   The final product should be a polished, production-ready browser extension.

---

