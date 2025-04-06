/**
 * Tests for the Gemini service
 */

const geminiService = require('../services/geminiService');

// Mock the Gemini API client
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            generateContent: jest.fn().mockResolvedValue({
              response: {
                text: jest.fn().mockReturnValue('This is a mock suggestion')
              }
            })
          };
        })
      };
    })
  };
});

describe('Gemini Service', () => {
  describe('generateSuggestion', () => {
    it('should generate a suggestion based on text input', async () => {
      const text = 'This is a test input';
      const toneProfile = {
        formality: 'conversational',
        sentenceStructure: 'moderate',
        vocabulary: 'moderate',
        figurativeLanguage: 'low',
        voice: 'neutral',
        commonPhrases: ['phrase 1', 'phrase 2'],
        sentenceStarters: ['starter 1', 'starter 2']
      };
      
      const suggestion = await geminiService.generateSuggestion(text, toneProfile);
      
      expect(suggestion).toBe('This is a mock suggestion');
    });
    
    it('should handle missing tone profile', async () => {
      const text = 'This is a test input';
      
      const suggestion = await geminiService.generateSuggestion(text);
      
      expect(suggestion).toBe('This is a mock suggestion');
    });
  });
  
  describe('analyzeTone', () => {
    it('should analyze the tone of a writing sample', async () => {
      const text = 'This is a test writing sample';
      
      const analysis = await geminiService.analyzeTone(text);
      
      // Since we're mocking the response, we expect it to be the parsed version of 'This is a mock suggestion'
      // In a real test, we would check for specific properties in the analysis object
      expect(analysis).toBeDefined();
    });
  });
});
