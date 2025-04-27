/**
 * Suggestions Router
 * 
 * This router handles requests for generating text suggestions
 * using the Gemini API.
 */

const express = require('express');
const router = express.Router();
const { generateSuggestion } = require('../services/geminiService');

/**
 * POST /api/suggestions
 * 
 * Generate a text suggestion based on the provided context
 * using the user's Gemini API key.
 * 
 * Request body:
 * - context: The text context to generate suggestions from
 * - apiKey: The user's Gemini API key
 * 
 * Response:
 * - Streamed text suggestion
 */
router.post('/', async (req, res, next) => {
  try {
    // Validate request body
    const { context, apiKey } = req.body;
    
    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Generate and stream the suggestion
    try {
      const suggestionGenerator = generateSuggestion(apiKey, context);
      
      for await (const chunk of suggestionGenerator) {
        // Write each chunk to the response
        res.write(chunk);
      }
      
      // End the response
      res.end();
    } catch (error) {
      // If an error occurs during streaming, send an error response
      if (!res.headersSent) {
        return next(error);
      }
      
      // If headers are already sent, end the response
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
