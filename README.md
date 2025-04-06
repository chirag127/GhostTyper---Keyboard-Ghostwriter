# GhostTyper – Keyboard Ghostwriter

GhostTyper is a browser extension that helps users write faster, smarter, and in their **own voice**. By learning the user's writing style from typed input and writing samples, it offers **real-time suggestions**, **auto-replies**, and **rewrites** in their unique tone.

## Features

-   **Real-Time Writing Suggestions**: Get suggestions as you type that match your writing style
-   **Persona Management**: Create and switch between different writing styles
-   **Writing Sample Analysis**: Upload your writing to train the AI on your style
-   **Text Manipulation**: Rephrase, shorten, or expand text while maintaining your tone
-   **Privacy Modes**: Choose between cloud processing for full features or local-only mode for privacy

## Project Structure

The project consists of two main components:

### Browser Extension (Chrome)

-   **Manifest V3** compliant Chrome extension
-   Detects input fields and monitors typing
-   Displays ghost text suggestions
-   Provides context menu options for text manipulation
-   Manages user settings and personas

### Backend Server

-   **Express.js** REST API
-   Handles writing sample analysis
-   Generates text suggestions
-   Manages user profiles and personas
-   Integrates with Google's Gemini API for AI text generation

## Installation

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or cloud instance)
-   Google Generative AI API key (for Gemini)

### Backend Setup

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

4. Edit the `.env` file with your MongoDB URI and Gemini API key.

5. Start the server:
    ```
    npm start
    ```

### Extension Setup

1. Navigate to the extension directory:

    ```
    cd extension
    ```

2. Load the extension in Chrome:
    - Open Chrome and go to `chrome://extensions/`
    - Enable "Developer mode"
    - Click "Load unpacked" and select the `extension` directory

## Usage

1. **Enable the Extension**: Click the GhostTyper icon in your browser toolbar and toggle it on.

2. **Add Writing Samples**: Paste examples of your writing in the popup to train the AI on your style.

3. **Get Suggestions**: Start typing in any text field on the web, and GhostTyper will suggest completions based on your style.

4. **Accept Suggestions**: Press Tab to accept a suggestion, or continue typing to ignore it.

5. **Manipulate Text**: Highlight text and right-click to access options for rephrasing, shortening, or expanding.

6. **Switch Personas**: Create different personas for different writing contexts (formal, casual, etc.) and switch between them.

## Development

### Extension Development

The extension is built with vanilla JavaScript, HTML, and CSS. Key files:

-   `manifest.json`: Extension configuration
-   `background.js`: Service worker for background tasks
-   `content.js`: Content script for interacting with web pages
-   `popup.html/js/css`: UI for the extension popup

### Backend Development

The backend is built with Express.js and MongoDB. Key files:

-   `server.js`: Main entry point
-   `routes/api.js`: API route definitions
-   `controllers/`: Business logic
-   `models/`: MongoDB models
-   `services/geminiService.js`: Gemini API integration

## API Documentation

### User Management

-   `POST /api/users`: Create a new user
-   `GET /api/users/:id`: Get user by ID
-   `PUT /api/users/:id`: Update user

### Persona Management

-   `POST /api/personas`: Create a new persona
-   `GET /api/personas`: Get all personas
-   `PUT /api/personas/:id`: Update a persona
-   `DELETE /api/personas/:id`: Delete a persona

### Writing Samples

-   `POST /api/style/train`: Add a writing sample
-   `GET /api/style/samples/:personaId`: Get writing samples for a persona

### Text Generation

-   `POST /api/suggest`: Get text suggestion
-   `POST /api/rephrase`: Rephrase text

## License

MIT

## Credits

-   Google Generative AI (Gemini) for text generation
-   MongoDB for data storage
-   Express.js for the backend framework
