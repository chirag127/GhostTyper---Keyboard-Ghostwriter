/**
 * Generate Routes
 * 
 * This module handles routes for generating text suggestions.
 */

const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const toneAnalyzer = require('../services/toneAnalyzer');

/**
 * Generate a suggestion based on the user's input and tone
 * POST /generate
 * 
 * Request body:
 * - text: The text input by the user
 * - userToneId: (optional) The ID of the user's tone profile
 * - tonePreference: (optional) The preferred tone for the suggestion
 * 
 * Response:
 * - success: Whether the request was successful
 * - suggestion: The generated suggestion
 */
router.post('/', async (req, res, next) => {
  try {
    const { text, userToneId, tonePreference } = req.body;
    
    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    // Get the user's tone profile if provided
    let toneProfile = null;
    if (userToneId) {
      try {
        toneProfile = await toneAnalyzer.getToneProfile(userToneId);
      } catch (error) {
        console.warn(`Tone profile not found for ID: ${userToneId}`);
        // Continue without the tone profile
      }
    }
    
    // If a tone preference is specified, override the tone profile
    if (tonePreference && tonePreference !== 'auto' && toneProfile) {
      toneProfile.formality = tonePreference;
      toneProfile.voice = tonePreference;
    }
    
    // Generate the suggestion
    const suggestion = await geminiService.generateSuggestion(text, toneProfile);
    
    // Return the suggestion
    res.status(200).json({
      success: true,
      suggestion
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
