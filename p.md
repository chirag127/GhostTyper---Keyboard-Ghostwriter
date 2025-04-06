Here’s a comprehensive **Product Requirements Document (PRD)** for **GhostTyper – Keyboard Ghostwriter**:

---

# 📄 Product Requirements Document (PRD)

## 💡 Product Name
**GhostTyper – Keyboard Ghostwriter**

---

## 🧠 Overview
GhostTyper is a browser extension that provides real-time, inline AI writing suggestions as users type into any form or text input field on the web. Designed like GitHub Copilot but for everyday writing, it mimics the user's personal tone using writing samples and allows users to accept suggestions with a simple press of the **Tab** key.

---

## 🎯 Goals
- Help users write faster and better by offering AI-powered ghostwriting assistance.
- Learn and replicate the user’s writing tone for a natural, consistent feel.
- Provide real-time inline suggestions seamlessly on any website.
- Work cross-browser (Chrome, Firefox, Safari).

---

## 🧩 Features

### 🔤 Inline Suggestions
- As the user types, GhostTyper generates subtle, gray-colored inline suggestions.
- Suggestions can be accepted with the `Tab` key or dismissed with `Esc`.

### 🧠 Tone Matching
- GhostTyper uses previous writing samples stored in MongoDB to match tone.
- Uses **Gemini 2.0 Flash Lite** to generate suggestions in the user’s tone.

### 🌐 Universal Input Support
- Works across all websites: Gmail, Twitter, LinkedIn, etc.
- Detects focus on text inputs, textareas, and contenteditable elements.

### ⚙️ Settings Panel
- Toggle extension on/off.
- Upload writing samples.
- Set tone preferences (casual, professional, etc.).
- Clear stored data.

### 🗂️ Writing Sample Management
- Users can upload samples (manual paste or upload `.txt`).
- Backend extracts tone/style using AI and stores it in MongoDB.

---

## 🏗️ Architecture

### 📦 Frontend (Browser Extension)
- **Tech Stack:** Manifest V3, HTML, CSS, JS
- **Modules:**
  - `contentScript.js`: Injects suggestion engine into web pages.
  - `suggestionOverlay.js`: Renders inline suggestions.
  - `keyboardHandler.js`: Detects `Tab`/`Esc` for accepting or rejecting.
  - `popup.html` + `popup.js`: Settings UI for the extension.
  - `env.js`: For base API URL config.
- **Cross-browser Support:**
  - Chrome, Firefox (using `webextension-polyfill`)
  - Safari (via Safari Web Extension Converter)

### 🔙 Backend (Express.js)
- **Endpoints:**
  - `POST /generate`: Generates suggestions using Gemini based on input + tone.
  - `POST /sample`: Upload user writing sample and extract tone.
  - `GET /user-tone/:id`: Fetch stored tone profile.
- **Services:**
  - Tone Analysis using Gemini 2.0 Flash Lite.
  - Suggestion Generator using Gemini 2.0 Flash Lite.
- **Storage:**
  - MongoDB for storing user writing samples and extracted tone profiles.

---

## 🧪 Flows

### ✍️ Typing Suggestion Flow
1. User types in a text field.
2. Content script detects typing and fetches recent context.
3. Sends text + tone profile to `/generate`.
4. API returns suggestion.
5. Overlay renders suggestion inline (grayed text).
6. User presses `Tab` to accept → text is inserted.

### 📝 Writing Sample Upload Flow
1. User opens extension popup.
2. Uploads text file or pastes writing sample.
3. Sends data to `/sample`.
4. Backend analyzes tone and stores in MongoDB.
5. Tone is linked with user session.

---

## 🔐 Permissions
- `activeTab`: To detect inputs on active pages.
- `storage`: To store user preferences and session tokens.
- `scripting`: For injecting scripts into webpages.

---

## 📦 Project Structure

```
ghosttyper/
│
├── extension/
│   ├── manifest.json
│   ├── contentScript.js
│   ├── suggestionOverlay.js
│   ├── keyboardHandler.js
│   ├── popup.html
│   ├── popup.js
│   └── env.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── generate.js
│   │   └── sample.js
│   ├── services/
│   │   ├── geminiService.js
│   │   └── toneAnalyzer.js
│   └── models/
│       └── UserTone.js
```

---

## 🧪 Testing
- ✅ Suggestion display & interaction (Tab/ESC)
- ✅ Tone matching accuracy
- ✅ Cross-site compatibility (Gmail, Notion, Twitter, etc.)
- ✅ Latency and response performance
- ✅ Mobile browser behavior (limited)

---

## 🚀 MVP Criteria
- Inline suggestion injection with tab-to-accept
- User tone analysis from uploaded samples
- Gemini-powered suggestion generation
- MongoDB storage for tone data
- Basic extension settings UI

---

## 🔮 other Features 
- Custom trigger (e.g., double space)
- Privacy toggle for incognito writing
- Sync settings across devices



the user prefers that you do not wait for the user to confirm the detailed plan. My github username is chirag127. Use the web search if any help is needed in the implementation of this browser extension. Also use the web search extensively. Also use the sequential thinking mcp server wherever possible. The code should be written in a modular way and should be easy to understand. The code should be well documented and should follow the best practices of coding. The code should be written in a way that it can be easily extended in the future. The code should be written in a way that it can be easily tested. The code should be written in a way that it can be easily debugged. The code should be written in a way that it can be easily maintained. The code should be written in a way that it can be easily deployed. The code should be written in a way that it can be easily integrated with other systems. use web search if you think you don't know anything.
