/**
 * Configuration for GhostTyper backend
 */

module.exports = {
  // Server configuration
  port: 3000,
  
  // MongoDB configuration
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/ghosttyper',
  
  // Gemini API configuration
  geminiApiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
  
  // Tone analysis configuration
  toneAnalysisPrompt: `
    Analyze the following text and extract the writer's tone, style, and writing patterns.
    Focus on aspects like:
    - Formality level (casual, professional, academic)
    - Sentence structure (simple, complex, varied)
    - Vocabulary preferences (simple, advanced, technical)
    - Use of idioms, metaphors, or other figurative language
    - Punctuation patterns
    - Common phrases or expressions
    - Typical sentence starters
    - Overall voice (authoritative, friendly, neutral)
    
    Return the analysis as a JSON object with these characteristics.
  `,
  
  // Suggestion generation configuration
  suggestionPrompt: `
    You are an AI writing assistant that helps users by suggesting text completions.
    Based on the provided text and the user's writing style, generate a natural continuation.
    The suggestion should:
    - Match the user's tone and style
    - Continue the thought or sentence naturally
    - Be concise (1-15 words)
    - Not repeat what's already been written
    
    Only return the suggested text, with no additional explanation or formatting.
  `
};
