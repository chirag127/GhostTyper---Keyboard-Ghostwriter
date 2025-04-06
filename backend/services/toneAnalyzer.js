/**
 * Tone Analyzer Service
 * 
 * This service analyzes writing samples to extract tone and style characteristics.
 * It uses the Gemini API for analysis and stores the results in MongoDB.
 */

const { v4: uuidv4 } = require('uuid');
const geminiService = require('./geminiService');
const UserTone = require('../models/UserTone');

/**
 * Analyze a writing sample and create a tone profile
 * @param {string} text - The writing sample to analyze
 * @returns {Promise<Object>} - The created tone profile
 */
async function analyzeSample(text) {
  try {
    // Generate a unique ID for the tone profile
    const userToneId = uuidv4();
    
    // Analyze the tone using Gemini
    const analysis = await geminiService.analyzeTone(text);
    
    // Create a new tone profile
    const userTone = new UserTone({
      userToneId,
      formality: analysis.formality || 'conversational',
      sentenceStructure: analysis.sentenceStructure || 'moderate',
      vocabulary: analysis.vocabulary || 'moderate',
      figurativeLanguage: analysis.figurativeLanguage || 'low',
      voice: analysis.voice || 'neutral',
      commonPhrases: analysis.commonPhrases || [],
      sentenceStarters: analysis.sentenceStarters || [],
      rawAnalysis: analysis,
      sampleText: text
    });
    
    // Save the tone profile to the database
    await userTone.save();
    
    return userTone;
  } catch (error) {
    console.error('Error analyzing sample:', error);
    throw error;
  }
}

/**
 * Get a tone profile by ID
 * @param {string} userToneId - The ID of the tone profile
 * @returns {Promise<Object>} - The tone profile
 */
async function getToneProfile(userToneId) {
  try {
    const userTone = await UserTone.findOne({ userToneId });
    return userTone;
  } catch (error) {
    console.error('Error getting tone profile:', error);
    throw error;
  }
}

/**
 * Update a tone profile with a new sample
 * @param {string} userToneId - The ID of the tone profile
 * @param {string} text - The new writing sample
 * @returns {Promise<Object>} - The updated tone profile
 */
async function updateToneProfile(userToneId, text) {
  try {
    // Get the existing tone profile
    const userTone = await UserTone.findOne({ userToneId });
    
    if (!userTone) {
      throw new Error('Tone profile not found');
    }
    
    // Analyze the new sample
    const analysis = await geminiService.analyzeTone(text);
    
    // Update the tone profile
    userTone.formality = analysis.formality || userTone.formality;
    userTone.sentenceStructure = analysis.sentenceStructure || userTone.sentenceStructure;
    userTone.vocabulary = analysis.vocabulary || userTone.vocabulary;
    userTone.figurativeLanguage = analysis.figurativeLanguage || userTone.figurativeLanguage;
    userTone.voice = analysis.voice || userTone.voice;
    userTone.commonPhrases = analysis.commonPhrases || userTone.commonPhrases;
    userTone.sentenceStarters = analysis.sentenceStarters || userTone.sentenceStarters;
    userTone.rawAnalysis = analysis;
    userTone.sampleText = text;
    userTone.updatedAt = Date.now();
    
    // Save the updated tone profile
    await userTone.save();
    
    return userTone;
  } catch (error) {
    console.error('Error updating tone profile:', error);
    throw error;
  }
}

module.exports = {
  analyzeSample,
  getToneProfile,
  updateToneProfile
};
