# GhostTyper Extension

This is the browser extension component of GhostTyper, providing real-time, inline AI writing suggestions as you type in web forms and text fields.

## Features

- **Inline Suggestions**: As you type, GhostTyper generates subtle, gray-colored inline suggestions that can be accepted with the `Tab` key or dismissed with `Esc`.
- **Multiple Display Modes**: Choose between inline suggestions, popup suggestions, or a sidebar display.
- **Universal Input Support**: Works across all websites in standard text input fields.
- **Customizable Settings**: Toggle the extension on/off, set your API key, blacklist specific sites, and adjust the suggestion delay.
- **Privacy-Focused**: Your API key is stored locally, and the extension automatically disables itself in password fields.
- **Powered by Google Gemini**: Uses Google's advanced Gemini AI model for high-quality, contextually relevant suggestions.

## Installation

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked" and select the `extension` folder
4. The GhostTyper extension should now be installed and visible in your toolbar

### Configuration

1. Click the GhostTyper icon in your browser toolbar
2. Click "Settings" to open the settings page
3. Enter your Google Gemini API key
4. Adjust other settings as desired
5. Click "Save Settings"

## Usage

1. **Enable the Extension**: Click the GhostTyper icon in your browser toolbar and toggle it on.
2. **Get Suggestions**: Start typing in any text field on the web, and GhostTyper will suggest completions after a brief pause.
3. **Accept Suggestions**: Press `Tab` to accept a suggestion, or press `Esc` to dismiss it.
4. **Customize Settings**: Adjust the suggestion delay, change the presentation mode, or blacklist specific websites in the Settings page.

## Settings

- **Enable GhostTyper**: Globally enable or disable the extension.
- **Gemini API Key**: Your Google Gemini API key for generating suggestions.
- **Suggestion Trigger Delay**: How long to wait after typing stops before generating a suggestion (in milliseconds).
- **Suggestion Presentation Mode**: How suggestions are displayed (Inline, Popup, or Side Panel).
- **Blocked Sites**: List of sites where GhostTyper should be disabled.
- **Backend URL**: URL of the GhostTyper backend service.

## Privacy & Security

- Your API key is stored locally in your browser using `chrome.storage.local`.
- The extension automatically disables itself in password fields.
- You can blacklist specific websites where you don't want suggestions to appear.
- No data is collected or stored by the extension beyond what's needed for its functionality.

## Development

### Project Structure

```
extension/
├── assets/        # Icons and images
├── css/           # Stylesheets
├── js/            # JavaScript files
│   ├── background.js  # Background service worker
│   ├── content.js     # Content script for text fields
│   ├── popup.js       # Popup UI logic
│   ├── settings.js    # Settings page logic
│   └── utils.js       # Utility functions
├── manifest.json  # Extension manifest
├── popup.html     # Popup UI
└── settings.html  # Settings page
```

### Building

To package the extension for distribution:

```bash
cd extension && zip -r ../ghosttyper-extension.zip *
```

## License

MIT
