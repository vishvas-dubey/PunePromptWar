const request = require('supertest');
const app = require('./server');

describe('Adaptive Learning Backend API', () => {

  test('POST /api/chat should return 401 if no API key is provided', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({
        history: [],
        message: 'Hello',
        mode: 'explain'
      });
    
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'No API key provided.');
  });

  test('GET / should serve the static HTML file', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

});
