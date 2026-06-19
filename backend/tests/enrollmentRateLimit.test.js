import { jest } from '@jest/globals';
import request from 'supertest';
import { clearRateLimitBuckets } from '../src/middlewares/rateLimitByIp.js';

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken: jest.fn() }) }
}));

const { default: app } = await import('../src/app.js');

beforeEach(() => {
  clearRateLimitBuckets();
});

describe('rate limit em POST /enrollments', () => {
  test('retorna 429 ao exceder o limite por IP', async () => {
    const statuses = [];

    for (let i = 0; i < 11; i += 1) {
      const response = await request(app).post('/enrollments').send({});
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 10)).not.toContain(429);
    expect(statuses[10]).toBe(429);
  });
});
