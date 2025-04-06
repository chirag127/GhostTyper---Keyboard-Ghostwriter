/**
 * Sample Routes
 * 
 * This module handles routes for uploading and analyzing writing samples.
 */

const express = require('express');
const router = express.Router();
const toneAnalyzer = require('../services/toneAnalyzer');

/**
 * Upload a writing sample for tone analysis
 * POST /sample
 * 
 * Request body:
 * - text: The writing sample to analyze
 * - userToneId: (optional) The ID of an existing tone profile to update
 * 
 * Response:
 * - success: Whether the request was successful
 * - userToneId: The ID of the created or updated tone profile
 * - message: A success or error message
 */
router.post('/', async (req, res, next) => {
  try {
    const { text, userToneId } = req.body;
    
    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    // Check if the text is long enough for analysis
    if (text.length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Writing sample must be at least 100 characters long'
      });
    }
    
    let userTone;
    
    // If a userToneId is provided, update the existing profile
    if (userToneId) {
      try {
        userTone = await toneAnalyzer.updateToneProfile(userToneId, text);
        
        return res.status(200).json({
          success: true,
          userToneId: userTone.userToneId,
          message: 'Tone profile updated successfully'
        });
      } catch (error) {
        console.warn(`Failed to update tone profile: ${error.message}`);
        // If the update fails, create a new profile
      }
    }
    
    // Create a new tone profile
    userTone = await toneAnalyzer.analyzeSample(text);
    
    res.status(201).json({
      success: true,
      userToneId: userTone.userToneId,
      message: 'Writing sample analyzed successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
