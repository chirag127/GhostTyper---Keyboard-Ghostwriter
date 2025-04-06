/**
 * Gemini API Service
 * 
 * This service handles interactions with the Gemini API for:
 * 1. Generating text suggestions
 * 2. Analyzing writing tone
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Get the Gemini 2.0 Flash Lite model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

/**
 * Generate a text suggestion based on the user's input and tone
 * @param {string} text - The text input by the user
 * @param {Object} toneProfile - The user's tone profile
 * @returns {Promise<string>} - The generated suggestion
 */
async function generateSuggestion(text, toneProfile) {
  try {
    // Create a prompt that includes the user's tone profile
    let prompt = config.suggestionPrompt;
    
    if (toneProfile) {
      prompt += `\n\nUser's writing style:
      - Formality: ${toneProfile.formality}
      - Sentence structure: ${toneProfile.sentenceStructure}
      - Vocabulary: ${toneProfile.vocabulary}
      - Figurative language: ${toneProfile.figurativeLanguage}
      - Voice: ${toneProfile.voice}`;
      
      if (toneProfile.commonPhrases && toneProfile.commonPhrases.length > 0) {
        prompt += `\n- Common phrases: ${toneProfile.commonPhrases.join(', ')}`;
      }
      
      if (toneProfile.sentenceStarters && toneProfile.sentenceStarters.length > 0) {
        prompt += `\n- Sentence starters: ${toneProfile.sentenceStarters.join(', ')}`;
      }
    }
    
    prompt += `\n\nUser's text: "${text}"`;
    prompt += `\n\nSuggestion:`;
    
    // Generate the suggestion
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text().trim();
    
    return suggestion;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw error;
  }
}

/**
 * Analyze the tone of a writing sample
 * @param {string} text - The writing sample to analyze
 * @returns {Promise<Object>} - The tone analysis
 */
async function analyzeTone(text) {
  try {
    // Create a prompt for tone analysis
    const prompt = `${config.toneAnalysisPrompt}\n\nText to analyze: "${text}"`;
    
    // Generate the analysis
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text().trim();
    
    // Extract the JSON object from the response
    let analysis;
    try {
      // Try to parse the entire response as JSON
      analysis = JSON.parse(analysisText);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a basic analysis object
        analysis = {
          formality: 'conversational',
          sentenceStructure: 'moderate',
          vocabulary: 'moderate',
          figurativeLanguage: 'low',
          voice: 'neutral',
          commonPhrases: [],
          sentenceStarters: []
        };
      }
    }
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing tone:', error);
    throw error;
  }
}

module.exports = {
  generateSuggestion,
  analyzeTone
};
