import { jest } from '@jest/globals';
import request from 'supertest';
import { clearDb, closeMemoryDb, connectMemoryDb } from './helpers/db.js';
import { clearRateLimitBuckets } from '../src/middlewares/rateLimitByIp.js';

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken: jest.fn() }) }
}));

const { default: app } = await import('../src/app.js');

beforeAll(async () => {
  await connectMemoryDb();
});

afterAll(async () => {
  await closeMemoryDb();
});

beforeEach(() => {
  clearRateLimitBuckets();
});

describe('rate limit em rotas publicas', () => {
  test('GET /enrollments/cpf/:cpf retorna 429 ao exceder limite', async () => {
    const statuses = [];

    for (let i = 0; i < 21; i += 1) {
      const response = await request(app).get('/enrollments/cpf/111.444.777-35');
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 20)).not.toContain(429);
    expect(statuses[20]).toBe(429);
  });

  test('GET /certificates/:workshopId/:cpf retorna 429 ao exceder limite', async () => {
    const statuses = [];
    const path = '/certificates/64b7f0000000000000000000/111.444.777-35';

    for (let i = 0; i < 16; i += 1) {
      const response = await request(app).get(path);
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 15)).not.toContain(429);
    expect(statuses[15]).toBe(429);
  });
});
