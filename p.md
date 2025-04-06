

# 🧾 Product Requirements Document (PRD)

## 📛 Product Name
**GhostTyper** – Keyboard Ghostwriter Extension

---

## 🧠 Overview
GhostTyper is a browser extension that helps users write faster, smarter, and in their **own voice**. By learning the user’s writing style from typed input and writing samples, it offers **real-time suggestions**, **auto-replies**, and **rewrites** in their unique tone.

---

## 🎯 Goals
- Enhance writing productivity across web platforms.
- Maintain writing **consistency and personality**.
- Offer AI-powered suggestions that **match the user’s tone**.
- Allow for multiple personas and styles per user.
- Respect privacy with both **local** and **cloud modes**.

---

## 👤 Target Users
- Content creators
- Professionals (emails, docs)
- Social media managers
- Non-native English speakers
- People with writing anxiety or writer’s block

---

## 🔧 Tech Stack

### Frontend
- **Chrome Extension (Manifest v3)**
- Vanilla JS, HTML, CSS for content scripts and popup
- Uses `MutationObserver` & `input`/`keydown` listeners to detect typing areas
- In-page overlay for real-time ghost suggestions

### Backend
- **Express.js** server
- REST API endpoints
- Handles:
  - Writing sample analysis
  - Suggestion generation
  - Persona switching

### AI/ML
- **Gemini-2.0-Flash-Lite**
  - For tone modeling and text generation
  - Prompted with user writing samples and real-time context

### Storage
- **MongoDB**
  - Stores user profiles, writing samples, tone embeddings, and persona presets

---

## 📦 Project Structure

```
ghosttyper/
├── extension/
│   ├── content.js
│   ├── background.js
│   ├── popup.html / popup.js / popup.css
│   ├── manifest.json
│   └── utils/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/ (User, WritingSample, Persona)
│   └── utils/
└── README.md
```

---

## ✨ Key Features

### 1. 🔤 Real-Time Writing Suggestions
- As user types, extension captures text context.
- Sends request to backend API:
  - `{textBefore, textNow, persona}`
- Receives suggestion:
  `"... that we should follow up by Friday."`
- Inserts ghost text suggestion inline (grayed out).

### 2. 👥 Persona Manager
- Users can create/edit personas:
  - Casual, Formal, Witty, Polite
- Stored in MongoDB and passed as prompt metadata.

### 3. 📥 Writing Sample Upload
- Users can paste or upload text samples via popup.
- Backend uses samples to generate tone embedding with Gemini.

### 4. 🪄 Rephrase / Shorten / Expand
- Right-click or highlight menu options:
  - Rephrase this text
  - Make it more formal
  - Shorten it
- Gemini generates new versions using tone profile.

### 5. 🔐 Privacy Modes
- **Local-only Mode:** No data leaves device (basic tone mimic, minimal AI).
- **Cloud Mode:** Uses backend + Gemini API for deeper personalization.

---

## 🧪 Sample API Design

### `POST /api/style/train`
> Input: `{ userId, writingSample }`
> Output: `{ personaId, toneSummary }`

### `POST /api/suggest`
> Input: `{ userId, currentText, personaId }`
> Output: `{ suggestionText }`

### `POST /api/rephrase`
> Input: `{ text, personaId, mode: "shorten" | "formal" }`
> Output: `{ altVersions: [ ... ] }`

---

## 📊 Success Metrics
- 🕐 Avg. time saved per user per writing session
- 📈 User engagement (daily suggestions used)
- 🎭 Persona usage stats (most selected styles)
- 😄 User satisfaction (feedback on tone accuracy)

---

## 🗓️ Timeline (MVP)

| Week | Task |
|------|------|
| 1 | Set up extension skeleton, detect input fields |
| 2 | Build backend + Gemini integration |
| 3 | Implement suggestion overlay UI |
| 4 | Add persona manager, sample upload |
| 5 | Final polish, privacy toggle, deploy |

---

## 🚧 Future Features
- 🔁 Auto-reply generation for Gmail/Slack
- 📚 Sync with Notion/Docs
- 🧠 Style comparison ("This is how you usually write vs. now")
- 🖼️ Voice → Text ghostwriting using Whisper

---
Perfect — here's the updated PRD with a dedicated section titled **"Gemini API Integration Example"**, including your provided code.

---

## 🔗 Gemini API Integration Example

### 🤖 Model: `gemini-2.0-flash-lite`

This extension uses **Gemini 2.0 Flash Lite** for fast and tone-aware text generation in real time. The backend sends prompts including user context, current text, and persona tone configuration.

### 📦 Example Code

Below is a basic example for using the Gemini API via `@google/generative-ai` to generate suggestions or rephrased content in GhostTyper:

```js
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const prompt = `input prompt here`;

  const result = await chatSession.sendMessage(prompt);

  // Access the output candidates
  const candidates = result.response.candidates;
  for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if (part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  // Final suggestion
  console.log(result.response.text());
}

run();
```

---

the user prefers that you do not wait for the user to confirm the detailed plan. My github username is chirag127. Use the web search if any help is needed in the implementation of this browser extension. Also use the web search extensively. Also use the sequential thinking mcp server wherever possible. The code should be written in a modular way and should be easy to understand. The code should be well documented and should follow the best practices of coding. The code should be written in a way that it can be easily extended in the future. The code should be written in a way that it can be easily tested. The code should be written in a way that it can be easily debugged. The code should be written in a way that it can be easily maintained. The code should be written in a way that it can be easily deployed. The code should be written in a way that it can be easily integrated with other systems. use web search if you think you don't know anything.
