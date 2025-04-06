/**
 * User Tone Routes
 * 
 * This module handles routes for retrieving and managing user tone profiles.
 */

const express = require('express');
const router = express.Router();
const UserTone = require('../models/UserTone');

/**
 * Get a user's tone profile by ID
 * GET /user-tone/:id
 * 
 * URL parameters:
 * - id: The ID of the tone profile
 * 
 * Response:
 * - success: Whether the request was successful
 * - toneProfile: The tone profile data
 */
router.get('/:id', async (req, res, next) => {
  try {
    const userToneId = req.params.id;
    
    // Find the tone profile
    const userTone = await UserTone.findOne({ userToneId });
    
    if (!userTone) {
      return res.status(404).json({
        success: false,
        message: 'Tone profile not found'
      });
    }
    
    // Return the tone profile
    res.status(200).json({
      success: true,
      toneProfile: {
        userToneId: userTone.userToneId,
        formality: userTone.formality,
        sentenceStructure: userTone.sentenceStructure,
        vocabulary: userTone.vocabulary,
        figurativeLanguage: userTone.figurativeLanguage,
        voice: userTone.voice,
        commonPhrases: userTone.commonPhrases,
        sentenceStarters: userTone.sentenceStarters,
        createdAt: userTone.createdAt,
        updatedAt: userTone.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a user's tone profile
 * DELETE /user-tone/:id
 * 
 * URL parameters:
 * - id: The ID of the tone profile
 * 
 * Response:
 * - success: Whether the request was successful
 * - message: A success or error message
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const userToneId = req.params.id;
    
    // Find and delete the tone profile
    const result = await UserTone.deleteOne({ userToneId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tone profile not found'
      });
    }
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Tone profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
