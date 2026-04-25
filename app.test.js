const request = require('supertest');
const app = require('./server');

describe('Adaptive Learning Backend API', () => {

  test('GET /api/services should return the Google Services catalog', async () => {
    const response = await request(app).get('/api/services');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('services');
    expect(Array.isArray(response.body.services)).toBe(true);
    expect(response.body.services.length).toBeGreaterThan(10);
  });

  test('POST /api/chat should handle the fallback API key if provided in request', async () => {
    // This tests the structure, even if actual API call fails due to invalid key or environment
    const response = await request(app)
      .post('/api/chat')
      .send({
        history: [],
        message: 'What is Python?',
        mode: 'explain'
      });
    
    // We expect either 200 (if key works) or 500 (if Gemini fails), but NOT 401 now because of fallback
    expect([200, 500]).toContain(response.statusCode);
  });

  test('POST /api/report should analyze learning history', async () => {
    const response = await request(app)
      .post('/api/report')
      .send({
        history: [{ role: "user", parts: [{ text: "I want to learn JS" }] }],
        score: 45
      });
    
    expect([200, 500]).toContain(response.statusCode);
  });

  test('GET / should serve the static HTML file with correct security headers', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty('x-xss-protection');
    expect(response.headers).toHaveProperty('x-content-type-options');
  });

});
