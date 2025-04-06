/**
 * UserTone model
 * 
 * This model stores the tone profile extracted from a user's writing samples.
 */

const mongoose = require('mongoose');

const userToneSchema = new mongoose.Schema({
  // Unique identifier for the user's tone profile
  // This will be shared with the extension to retrieve the tone
  userToneId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Formality level (casual, professional, academic)
  formality: {
    type: String,
    enum: ['casual', 'conversational', 'professional', 'formal', 'academic'],
    default: 'conversational'
  },
  
  // Sentence structure (simple, complex, varied)
  sentenceStructure: {
    type: String,
    enum: ['simple', 'moderate', 'complex', 'varied'],
    default: 'moderate'
  },
  
  // Vocabulary level (simple, moderate, advanced, technical)
  vocabulary: {
    type: String,
    enum: ['simple', 'moderate', 'advanced', 'technical'],
    default: 'moderate'
  },
  
  // Use of figurative language (low, moderate, high)
  figurativeLanguage: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'low'
  },
  
  // Overall voice (authoritative, friendly, neutral)
  voice: {
    type: String,
    enum: ['authoritative', 'friendly', 'neutral', 'casual', 'formal'],
    default: 'neutral'
  },
  
  // Common phrases or expressions used by the writer
  commonPhrases: {
    type: [String],
    default: []
  },
  
  // Typical sentence starters used by the writer
  sentenceStarters: {
    type: [String],
    default: []
  },
  
  // Raw tone analysis from Gemini
  rawAnalysis: {
    type: Object,
    default: {}
  },
  
  // Sample text used for analysis
  sampleText: {
    type: String
  },
  
  // Creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Last update timestamp
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userToneSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserTone', userToneSchema);
