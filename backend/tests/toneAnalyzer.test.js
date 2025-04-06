/**
 * Tests for the Tone Analyzer service
 */

const toneAnalyzer = require('../services/toneAnalyzer');
const geminiService = require('../services/geminiService');
const UserTone = require('../models/UserTone');

// Mock dependencies
jest.mock('../services/geminiService');
jest.mock('../models/UserTone');

describe('Tone Analyzer Service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock implementation for geminiService.analyzeTone
    geminiService.analyzeTone.mockResolvedValue({
      formality: 'conversational',
      sentenceStructure: 'moderate',
      vocabulary: 'moderate',
      figurativeLanguage: 'low',
      voice: 'neutral',
      commonPhrases: ['phrase 1', 'phrase 2'],
      sentenceStarters: ['starter 1', 'starter 2']
    });
    
    // Mock implementation for UserTone.prototype.save
    UserTone.prototype.save = jest.fn().mockResolvedValue(true);
    
    // Mock implementation for UserTone.findOne
    UserTone.findOne = jest.fn().mockImplementation((query) => {
      if (query.userToneId === 'existing-id') {
        return Promise.resolve({
          userToneId: 'existing-id',
          formality: 'conversational',
          sentenceStructure: 'moderate',
          vocabulary: 'moderate',
          figurativeLanguage: 'low',
          voice: 'neutral',
          commonPhrases: ['phrase 1', 'phrase 2'],
          sentenceStarters: ['starter 1', 'starter 2'],
          rawAnalysis: {},
          sampleText: 'Sample text',
          save: jest.fn().mockResolvedValue(true)
        });
      } else {
        return Promise.resolve(null);
      }
    });
  });
  
  describe('analyzeSample', () => {
    it('should analyze a writing sample and create a tone profile', async () => {
      const text = 'This is a test writing sample';
      
      const result = await toneAnalyzer.analyzeSample(text);
      
      expect(geminiService.analyzeTone).toHaveBeenCalledWith(text);
      expect(UserTone).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.userToneId).toBeDefined();
    });
  });
  
  describe('getToneProfile', () => {
    it('should get a tone profile by ID', async () => {
      const userToneId = 'existing-id';
      
      const result = await toneAnalyzer.getToneProfile(userToneId);
      
      expect(UserTone.findOne).toHaveBeenCalledWith({ userToneId });
      expect(result).toBeDefined();
      expect(result.userToneId).toBe(userToneId);
    });
    
    it('should return null for non-existent tone profile', async () => {
      const userToneId = 'non-existent-id';
      
      const result = await toneAnalyzer.getToneProfile(userToneId);
      
      expect(UserTone.findOne).toHaveBeenCalledWith({ userToneId });
      expect(result).toBeNull();
    });
  });
  
  describe('updateToneProfile', () => {
    it('should update an existing tone profile', async () => {
      const userToneId = 'existing-id';
      const text = 'This is a new writing sample';
      
      const result = await toneAnalyzer.updateToneProfile(userToneId, text);
      
      expect(UserTone.findOne).toHaveBeenCalledWith({ userToneId });
      expect(geminiService.analyzeTone).toHaveBeenCalledWith(text);
      expect(result).toBeDefined();
      expect(result.userToneId).toBe(userToneId);
      expect(result.save).toHaveBeenCalled();
    });
    
    it('should throw an error for non-existent tone profile', async () => {
      const userToneId = 'non-existent-id';
      const text = 'This is a new writing sample';
      
      await expect(toneAnalyzer.updateToneProfile(userToneId, text))
        .rejects.toThrow('Tone profile not found');
      
      expect(UserTone.findOne).toHaveBeenCalledWith({ userToneId });
      expect(geminiService.analyzeTone).not.toHaveBeenCalled();
    });
  });
});
