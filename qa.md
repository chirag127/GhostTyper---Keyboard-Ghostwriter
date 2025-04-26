
---

**Project Vision & Core Functionality**

1.  **Primary Goal:** What's the absolute core problem GhostTyper solves for users?
    a)  Speeding up writing by suggesting completions.
    b)  Improving writing quality with better phrasing/grammar suggestions.
    c)  Reducing writer's block by offering ideas.
    d)  All of the above.
    *(Suggestion: d) All of the above)*
    **Answer:** d

2.  **Suggestion Trigger:** How should the AI suggestions be triggered?
    a)  Automatically after a short pause (e.g., 500ms) while typing.
    b)  Only when the user presses a specific hotkey (e.g., Ctrl+Space).
    c)  Automatically, but only after typing a minimum number of words (e.g., 3 words).
    *(Suggestion: a) Automatic pause detection feels most like Copilot, but requires careful performance tuning. Let's start with this.)*
    **Answer:** a

3.  **Suggestion Display:** How should the suggestion appear to the user?
    a)  Directly inline with the typed text, often in a greyed-out style (like Copilot).
    b)  In a small popup window near the cursor.
    c)  In the extension's popup menu.
    *(Suggestion: a) Inline display matches the Copilot experience you mentioned.)*
    **Answer:** a

4.  **Suggestion Acceptance:** You mentioned the Tab key for accepting. Is this the only way?
    a)  Yes, only the Tab key.
    b)  Tab key or clicking on the suggestion (if visually distinct).
    c)  Tab key or Enter key (though Enter usually submits forms).
    *(Suggestion: a) Only Tab key is simple and standard for this type of interaction.)*
    **Answer:**b

5.  **Suggestion Dismissal:** How does a user ignore or dismiss a suggestion?
    a)  Keep typing – the suggestion disappears.
    b)  Press the Escape (Esc) key.
    c)  Both a and b.
    *(Suggestion: c) Both options provide flexibility.)*
    **Answer:**c

**AI & Backend**

6.  **AI Model Provider:** Which AI service should power the suggestions?
    a)  OpenAI (GPT-3.5-turbo, GPT-4, etc.) - Pros: High quality, widely used. Cons: Cost per API call, potential latency.
    b)  Anthropic (Claude) - Pros: Strong conversational/writing abilities. Cons: Cost, potentially different API style.
    c)  Google (Gemini) - Pros: Integrated ecosystem potential. Cons: API maturity/availability might vary.
    d)  User must provide their own API key for a chosen service (e.g., OpenAI).
    *(Suggestion: d) Requiring users to provide their own OpenAI API key is the simplest approach for V1, avoiding backend infrastructure and billing complexities for you. We'll need a settings page for this.)*
    **Answer:** as there will be no backend for the extension, the user will have to provide their own gemini api key.

7.  **Context for AI:** How much text context should be sent to the AI to generate a relevant suggestion?
    a)  Only the current sentence being typed.
    b)  The entire content of the text field.
    c)  The last N characters (e.g., 500 characters).
    d)  Smart context (e.g., current paragraph).
    *(Suggestion: c) Sending the last N characters (e.g., 500-1000) balances context quality with performance and API cost. Let's aim for ~1000 chars.)*
    **Answer:** b

8.  **API Key Handling:** Assuming users provide their own API key (as per suggestion 6d), how should it be stored?
    a)  `chrome.storage.sync` (Synced across user's browsers, but potentially less secure if sync is compromised, has size limits).
    b)  `chrome.storage.local` (Stored only on the local machine, generally more secure for sensitive data like keys).
    *(Suggestion: b) `chrome.storage.local` is preferable for API keys due to better security.)*
    **Answer:**a

**User Interface & Experience**

9.  **Extension Settings:** What options should be available to the user?
    a)  Enter/Manage their AI API Key.
    b)  Enable/Disable GhostTyper globally.
    c)  Optionally disable GhostTyper on specific websites (blacklist).
    d)  Optionally enable GhostTyper *only* on specific websites (whitelist).
    e)  Adjust suggestion delay/aggressiveness (maybe later).
    f)  All of the above (a, b, c).
    *(Suggestion: f) Providing API key input, global toggle, and a site blacklist offers good initial control.)*
    **Answer:** f

10. **Settings Access:** How will users access these settings?
    a)  Via the browser's extension icon (clicking it opens a popup).
    b)  Via the browser's extensions management page.
    *(Suggestion: a) A dedicated popup via the extension icon is standard and user-friendly.)*
    **Answer:** a

11. **Visual Integration:** How critical is it that the inline suggestion *perfectly* matches the website's text styling?
    a)  Very critical – it should blend seamlessly. (Harder to implement reliably across all sites).
    b)  Moderately critical – it should look good, but a standard subtle style (e.g., grey text) is acceptable. (More feasible).
    c)  Not critical – functionality over perfect style.
    *(Suggestion: b) Aiming for a good, consistent, subtle style is achievable and provides a good user experience without excessive complexity.)*
    **Answer:** b

12. **Handling Sensitive Fields:** Should GhostTyper automatically avoid providing suggestions in sensitive input fields?
    a)  Yes, attempt to detect password fields (`<input type="password">`) and disable automatically.
    b)  Yes, allow users to manually disable it for specific fields on a page (more complex).
    c)  No, rely on the user to disable it via the site blacklist or global toggle if needed.
    *(Suggestion: a) Automatically detecting and disabling for password fields is a minimum security/privacy measure.)*
    **Answer:** a

**Technical & Platform**

13. **Target Browsers:** Which browsers should GhostTyper initially support?
    a)  Google Chrome only.
    b)  Google Chrome and Mozilla Firefox.
    c)  Chrome, Firefox, Edge, and other Chromium-based browsers.
    *(Suggestion: c) Building with standard WebExtension APIs and Manifest V3 generally allows targeting Chrome, Edge, and other Chromium browsers relatively easily. Firefox support might require minor adjustments.)*
    **Answer:** c

14. **Performance:** How should the extension handle potential performance impacts (e.g., API latency, processing)?
    a)  Use debouncing/throttling for triggering API calls (don't call on every keystroke).
    b)  Make API calls asynchronous so they don't block the user's typing.
    c)  Show a subtle loading indicator if the AI takes too long (e.g., > 1 second).
    d)  All of the above.
    *(Suggestion: d) All these techniques are crucial for a smooth real-time suggestion experience.)*
    **Answer:** d

15. **Error Handling:** What should happen if the AI API call fails (e.g., invalid key, network error, API down)?
    a)  Silently fail – no suggestion appears.
    b)  Show a small, non-intrusive error icon or message near the text field.
    c)  Log the error to the browser's console for debugging.
    d)  All of the above.
    *(Suggestion: d) Silent failure for the user, but providing feedback (icon/message) on repeated failures and logging errors is good practice.)*
    **Answer:** d

**Scope & Future**

16. **Out of Scope for V1:** Are there any features explicitly *not* planned for this initial version? (e.g., multi-language support, complex formatting suggestions, document-level analysis)
    *(Suggestion: Let's keep V1 focused on inline text completion in English for standard text fields. Things like complex formatting, multi-language, or integration with specific web apps (like Google Docs custom UI) are out of scope initially.)*
    **Answer:**

17. **Success Metrics:** How would you measure if GhostTyper is successful?
    a)  Number of active users.
    b)  Frequency of suggestion acceptance (Tab presses).
    c)  User ratings/reviews in the extension store.
    d)  Qualitative feedback (users saying it saves time/improves writing).
    e)  All of the above.
    *(Suggestion: e) A mix of quantitative and qualitative metrics gives the best picture.)*
    **Answer:** e

**Visuals & Design**

18. **Diagrams/Wireframes:** Do you have any existing sketches, wireframes, or diagrams for GhostTyper? If so, could you describe them or share them? (Just describing the key screens/flows is fine!)
    *(Suggestion: Even a simple description helps, e.g., "The popup just needs a field for the API key, an on/off toggle, and a text area for blacklisted sites.")*
    **Answer:** a simple wireframe showing the layout of the popup with the API key field, toggle, and blacklist area.

IMPORTANT: use the following code for the gemini integration:
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