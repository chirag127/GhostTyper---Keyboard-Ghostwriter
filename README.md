# GhostTyper – Keyboard Ghostwriter

GhostTyper is a browser extension that provides real-time, inline AI writing suggestions as you type in web forms and text fields. Designed like GitHub Copilot but for everyday writing, it allows users to accept suggestions with a simple press of the **Tab** key.

![GhostTyper Logo](extension/assets/ghost-logo.svg)

## Features

-   **Inline Suggestions**: As you type, GhostTyper generates subtle, gray-colored inline suggestions that can be accepted with the `Tab` key or dismissed with `Esc`.
-   **Multiple Display Modes**: Choose between inline suggestions, popup suggestions, or a sidebar display.
-   **Universal Input Support**: Works across all websites in standard text input fields.
-   **Customizable Settings**: Toggle the extension on/off, set your API key, blacklist specific sites, and adjust the suggestion delay.
-   **Privacy-Focused**: Your API key is stored locally, and the extension automatically disables itself in password fields.
-   **Powered by Google Gemini**: Uses Google's advanced Gemini AI model for high-quality, contextually relevant suggestions.

## Project Structure

```
ghosttyper/
├── extension/         # Chrome extension (Manifest V3)
│   ├── assets/        # Icons and images
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   │   ├── background.js  # Background service worker
│   │   ├── content.js     # Content script for text fields
│   │   ├── popup.js       # Popup UI logic
│   │   └── settings.js    # Settings page logic
│   ├── manifest.json  # Extension manifest
│   ├── popup.html     # Popup UI
│   └── settings.html  # Settings page
│
├── backend/           # Express.js server (for future features)
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   └── server.js      # Main server file
```

## Installation

### Prerequisites

-   A Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Extension Setup

1. Clone this repository:

    ```
    git clone https://github.com/chirag127/GhostTyper---Keyboard-Ghostwriter.git
    cd GhostTyper---Keyboard-Ghostwriter
    ```

2. Generate the extension icons:

    ```
    npm install
    node generate-icons.js
    ```

3. Load the extension in your browser:

    - **Chrome**:

        - Go to `chrome://extensions/`
        - Enable "Developer mode"
        - Click "Load unpacked"
        - Select the `extension` folder

    - **Firefox** (experimental):
        - Go to `about:debugging#/runtime/this-firefox`
        - Click "Load Temporary Add-on"
        - Select any file in the `extension` folder

### Backend Setup

The backend server is required for the extension to function properly, as it handles the Gemini API integration.

1. Navigate to the backend directory:

    ```
    cd backend
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create a `.env` file based on `.env.example`:

    ```
    cp .env.example .env
    ```

4. Start the server:
    ```
    npm start
    ```

## Usage

1. **Enable the Extension**: Click the GhostTyper icon in your browser toolbar and toggle it on.

2. **Enter Your API Key**: Go to Settings and enter your Google Gemini API key.

3. **Get Suggestions**: Start typing in any text field on the web, and GhostTyper will suggest completions after a brief pause.

4. **Accept Suggestions**: Press `Tab` to accept a suggestion, or press `Esc` to dismiss it.

5. **Customize Settings**: Adjust the suggestion delay, change the presentation mode, or blacklist specific websites in the Settings page.

## Privacy & Security

-   Your API key is stored locally in your browser using `chrome.storage.local`.
-   The extension automatically disables itself in password fields.
-   You can blacklist specific websites where you don't want suggestions to appear.
-   No data is collected or stored by the extension beyond what's needed for its functionality.

## Development

### Building the Extension

To package the extension for distribution:

```
npm install
node generate-icons.js
cd extension && zip -r ../ghosttyper-extension.zip *
```

### Features Implemented

-   **Browser Extension**: Chrome extension with Manifest V3 support
-   **Backend Service**: Node.js/Express backend for Gemini API integration
-   **Real-time Suggestions**: Inline, popup, or panel display modes
-   **Customizable Settings**: API key management, site filtering, trigger delay
-   **Keyboard Shortcuts**: Tab to accept, Esc to dismiss
-   **Anonymous Telemetry**: Basic usage statistics collection with MongoDB storage
-   **Security**: HTTPS communication, local API key storage, XSS protection
-   **Database Integration**: MongoDB for persistent storage of telemetry data

### Future Enhancements

-   Support for additional browsers (Firefox, Edge, Safari)
-   More sophisticated context gathering for better suggestions
-   User accounts and settings synchronization
-   Centralized API key management
-   Advanced telemetry and analytics dashboard

## License

MIT

## Credits

-   [Google Gemini API](https://ai.google.dev/gemini-api/docs) for AI-powered text generation
-   Developed by [Chirag Singhal](https://github.com/chirag127)
