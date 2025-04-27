# GhostTyper Backend

This is the backend service for the GhostTyper browser extension. It provides API endpoints for generating text suggestions using the Google Gemini API and collecting anonymous telemetry data.

## Features

- **Suggestion Generation**: Generates text suggestions using the Google Gemini API
- **Telemetry Collection**: Collects anonymous telemetry data for tracking usage
- **Security**: Implements CORS, rate limiting, and other security measures
- **API Key Handling**: Never stores user API keys, only uses them for the duration of the request

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Modify the `.env` file as needed.

### Running the Server

#### Development

```bash
npm run dev
```

#### Production

```bash
npm start
```

## API Endpoints

### Suggestions

#### `POST /api/suggestions`

Generate a text suggestion based on the provided context using the user's Gemini API key.

**Request Body:**

```json
{
  "context": "The text context to generate suggestions from",
  "apiKey": "The user's Gemini API key"
}
```

**Response:**

Streamed text suggestion.

### Telemetry

#### `POST /api/telemetry`

Record telemetry data.

**Request Body:**

```json
{
  "suggestionsShown": 10,
  "suggestionsAccepted": 5
}
```

**Response:**

```json
{
  "suggestionsShown": 100,
  "suggestionsAccepted": 50
}
```

#### `GET /api/telemetry/daily`

Get daily telemetry data.

**Query Parameters:**

- `date`: The date to get data for (YYYY-MM-DD format)

**Response:**

```json
{
  "suggestionsShown": 100,
  "suggestionsAccepted": 50
}
```

#### `GET /api/telemetry/all`

Get all telemetry data.

**Response:**

```json
{
  "daily": {
    "2023-10-27": {
      "suggestionsShown": 100,
      "suggestionsAccepted": 50
    }
  }
}
```

## Security

- CORS is configured to only allow requests from the GhostTyper extension
- Rate limiting is implemented to prevent abuse
- API keys are never stored or logged
- Helmet is used to set security headers

## License

MIT
