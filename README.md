# GhostTyper – Keyboard Ghostwriter

GhostTyper is a browser extension that provides real-time, inline AI writing suggestions as you type in web forms and text fields. Designed like GitHub Copilot but for everyday writing, it allows users to accept suggestions with a simple press of the **Tab** key.

![GhostTyper Logo](extension/assets/ghost-logo.svg)

## Features

-   **Inline Suggestions**: As you type, GhostTyper generates subtle, gray-colored inline suggestions that can be accepted with the `Tab` key or dismissed with `Esc`.
-   **Universal Input Support**: Works across all websites in standard text input fields.
-   **Customizable Settings**: Toggle the extension on/off, set your API key, blacklist specific sites, and adjust the suggestion delay.
-   **Privacy-Focused**: Your API key is stored locally, and the extension automatically disables itself in password fields.
-   **Powered by Google Gemini**: Uses Google's advanced Gemini AI model for high-quality, contextually relevant suggestions.

## Project Structure

```
extension/
├── assets/            # Icons and images
├── css/               # Stylesheets
├── js/                # JavaScript files
│   ├── background.js  # Background service worker
│   ├── content.js     # Content script for text fields
│   ├── popup.js       # Popup UI logic
│   ├── settings.js    # Settings page logic
│   └── utils.js       # Utility functions
├── manifest.json      # Extension manifest
├── popup.html         # Popup UI
└── settings.html      # Settings page
```

## Installation

### Prerequisites

-   A Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

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

2. **Enter Your API Key**: Go to Settings and enter your Google Gemini API key.

3. **Get Suggestions**: Start typing in any text field on the web, and GhostTyper will suggest completions after a brief pause.

4. **Accept Suggestions**: Press `Tab` to accept a suggestion, or press `Esc` to dismiss it.

5. **Customize Settings**: Adjust the suggestion delay or blacklist specific websites in the Settings page.

## Privacy & Security

-   Your API key is stored locally in your browser using `chrome.storage.sync`.
-   The extension automatically disables itself in password fields.
-   You can blacklist specific websites where you don't want suggestions to appear.
-   No data is collected or stored by the extension beyond what's needed for its functionality.

## Development

### Building

To build the extension for distribution:

1. Install dependencies: `npm install`
2. Generate icons: `node generate-icons.js`
3. Package the extension: `cd extension && zip -r ../ghosttyper-extension.zip *`

## License

MIT

## Credits

-   [Google Gemini API](https://ai.google.dev/gemini-api/docs) for AI-powered text generation
