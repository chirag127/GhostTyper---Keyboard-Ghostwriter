/**
 * Server tests for GhostTyper backend
 */

const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

describe('API Routes', () => {
  // Test the generate endpoint
  describe('POST /generate', () => {
    it('should require text in the request body', async () => {
      const response = await request(app)
        .post('/generate')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  // Test the sample endpoint
  describe('POST /sample', () => {
    it('should require text in the request body', async () => {
      const response = await request(app)
        .post('/sample')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
    
    it('should require text to be at least 100 characters', async () => {
      const response = await request(app)
        .post('/sample')
        .send({ text: 'This is too short' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  // Test the user-tone endpoint
  describe('GET /user-tone/:id', () => {
    it('should return 404 for non-existent tone profile', async () => {
      const response = await request(app)
        .get('/user-tone/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
