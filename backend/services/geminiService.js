/**
 * Gemini API Service
 * 
 * This service handles the integration with Google's Gemini API.
 * It provides functions for generating text suggestions using the Gemini model.
 */

const { GoogleGenAI } = require('@google/genai');

/**
 * Generate text suggestions using the Gemini API
 * 
 * @param {string} apiKey - The user's Gemini API key
 * @param {string} context - The text context to generate suggestions from
 * @returns {AsyncGenerator} - A generator that yields text chunks
 */
async function* generateSuggestion(apiKey, context) {
  try {
    // Initialize the Gemini API client with the user's API key
    const genAI = new GoogleGenAI(apiKey);
    
    // Configure the request
    const config = {
      responseMimeType: 'text/plain',
    };
    
    // Use the specified model
    const model = 'gemini-2.5-flash-preview-04-17';
    
    // Prepare the content for the API request
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Continue this text with a helpful suggestion: ${context}`,
          },
        ],
      },
    ];

    // Generate content stream
    const response = await genAI.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Yield each chunk as it arrives
    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    // Throw a standardized error
    const errorMessage = error.message || 'Error generating suggestion';
    const errorStatus = error.status || 500;
    
    const standardError = new Error(errorMessage);
    standardError.status = errorStatus;
    standardError.originalError = error;
    
    throw standardError;
  }
}

module.exports = {
  generateSuggestion
};
