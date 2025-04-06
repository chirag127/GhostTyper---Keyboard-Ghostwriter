# GhostTyper – Keyboard Ghostwriter

GhostTyper is a browser extension that provides real-time, inline AI writing suggestions as users type into any form or text input field on the web. Designed like GitHub Copilot but for everyday writing, it mimics the user's personal tone using writing samples and allows users to accept suggestions with a simple press of the **Tab** key.

## Features

-   **Inline Suggestions**: As you type, GhostTyper generates subtle, gray-colored inline suggestions that can be accepted with the `Tab` key or dismissed with `Esc`.
-   **Tone Matching**: GhostTyper uses your previous writing samples to match your tone, making suggestions feel natural and consistent with your style.
-   **Universal Input Support**: Works across all websites including Gmail, Twitter, LinkedIn, and more.
-   **Customizable Settings**: Toggle the extension on/off, upload writing samples, set tone preferences, and manage your data.

## Project Structure

The project consists of two main components:

### Browser Extension

-   **Manifest V3** compliant browser extension
-   **contentScript.js**: Detects text inputs and handles suggestions
-   **suggestionOverlay.js**: Renders inline suggestions
-   **keyboardHandler.js**: Handles keyboard events for accepting/rejecting suggestions
-   **popup.html/js**: Provides the settings UI
-   Cross-browser compatibility with **webextension-polyfill**

### Backend Server

-   **Express.js** REST API
-   **MongoDB** for storing user tone profiles
-   **Gemini 2.0 Flash Lite** integration for AI-powered text generation
-   Tone analysis for matching user's writing style
-   Suggestion generation based on user's input and tone

## Installation

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or cloud instance)
-   Google Generative AI API key (for Gemini)

### Backend Setup

1. Clone this repository:

    ```
    git clone https://github.com/chirag127/GhostTyper---Keyboard-Ghostwriter.git
    cd GhostTyper---Keyboard-Ghostwriter
    ```

2. Install backend dependencies:

    ```
    npm run install:backend
    ```

3. Configure the backend:

    - Create a `.env` file in the `backend` directory with the following variables:
        ```
        PORT=3000
        MONGO_URI=mongodb://localhost:27017/ghosttyper
        GEMINI_API_KEY=your-gemini-api-key
        ```

4. Start the server:
    ```
    npm run start:backend
    ```

### Extension Setup

1. Load the extension in your browser:

    - **Chrome**:

        - Go to `chrome://extensions/`
        - Enable "Developer mode"
        - Click "Load unpacked"
        - Select the `extension` folder

    - **Firefox**:

        - Go to `about:debugging#/runtime/this-firefox`
        - Click "Load Temporary Add-on"
        - Select any file in the `extension` folder

    - **Safari**:
        - Use Safari Web Extension Converter to convert the extension
        - Follow the prompts to install the extension

## Usage

1. **Enable the Extension**: Click the GhostTyper icon in your browser toolbar and toggle it on.

2. **Add Writing Samples**: Paste examples of your writing in the popup to train the AI on your style.

3. **Get Suggestions**: Start typing in any text field on the web, and GhostTyper will suggest completions based on your style.

4. **Accept Suggestions**: Press Tab to accept a suggestion, or press Esc to dismiss it.

5. **Adjust Settings**: Change tone preferences (casual, professional, etc.) in the extension popup.

## Development

### Extension Development

The extension is built with vanilla JavaScript, HTML, and CSS. Key files:

-   `manifest.json`: Extension configuration
-   `contentScript.js`: Detects text inputs and handles suggestions
-   `suggestionOverlay.js`: Renders inline suggestions
-   `keyboardHandler.js`: Handles keyboard events
-   `popup.html/js`: UI for the extension popup
-   `env.js`: Configuration variables

### Backend Development

The backend is built with Express.js and MongoDB. Key files:

-   `server.js`: Main entry point
-   `routes/`: API route definitions (generate.js, sample.js, userTone.js)
-   `services/`: Business logic (geminiService.js, toneAnalyzer.js)
-   `models/`: MongoDB models (UserTone.js)
-   `config.js`: Configuration settings

## API Documentation

### Suggestion Generation

-   `POST /generate`: Generate text suggestions
    -   Request body: `{ text, userToneId, tonePreference }`
    -   Response: `{ success, suggestion }`

### Writing Samples

-   `POST /sample`: Upload a writing sample for tone analysis
    -   Request body: `{ text, userToneId }`
    -   Response: `{ success, userToneId, message }`

### User Tone Profiles

-   `GET /user-tone/:id`: Get a user's tone profile
    -   Response: `{ success, toneProfile }`
-   `DELETE /user-tone/:id`: Delete a user's tone profile
    -   Response: `{ success, message }`

## License

MIT

## Credits

-   [Gemini 2.0 Flash Lite](https://ai.google.dev/gemini-api/docs) for AI-powered text generation
-   [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for cross-browser compatibility
-   MongoDB for data storage
-   Express.js for the backend framework
