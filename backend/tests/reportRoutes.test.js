import { jest } from '@jest/globals';
import request from 'supertest';
import { clearDb, closeMemoryDb, connectMemoryDb } from './helpers/db.js';

const verifyIdTokenMock = jest.fn();

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken: verifyIdTokenMock }) }
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const { default: Workshop } = await import('../src/models/Workshop.js');
const { default: Enrollment } = await import('../src/models/Enrollment.js');

async function seedData() {
  const professor = await User.create({ name: 'Ana', email: 'ana@example.com', type: 'professor', firebaseUid: 'uid-prof' });
  const tutor = await User.create({ name: 'Tito', email: 'tito@example.com', type: 'tutor', firebaseUid: 'uid-tutor' });
  const ativa = await Workshop.create({ name: 'Ativa', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id, tutors: [tutor._id] });
  const finalizada = await Workshop.create({ name: 'Final', description: 'd', date: new Date('2026-01-01'), workload: 8, professor: professor._id, status: 'finalizada' });
  await Enrollment.create({ name: 'Joao', age: 20, cpf: '11144477735', workshop: ativa._id });
  return { professor, ativa, finalizada };
}

beforeAll(async () => {
  await connectMemoryDb();
});

afterAll(async () => {
  await closeMemoryDb();
});

afterEach(async () => {
  await clearDb();
  jest.clearAllMocks();
});

describe('rotas de relatorios', () => {
  test('GET /reports/dashboard exige autenticacao (401)', async () => {
    const response = await request(app).get('/reports/dashboard');
    expect(response.status).toBe(401);
  });

  test('GET /reports/dashboard retorna totais para usuario autenticado', async () => {
    await seedData();
    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-prof' });

    const response = await request(app)
      .get('/reports/dashboard')
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      totalWorkshops: 2,
      activeWorkshops: 1,
      finishedWorkshops: 1
    });
    expect(response.body.participants).toBe(2);
  });

  test('GET /reports/workshop-participants lista participantes e tutores', async () => {
    await seedData();
    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-prof' });

    const response = await request(app)
      .get('/reports/workshop-participants')
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    const ativa = response.body.find((item) => item.name === 'Ativa');
    expect(ativa.totalParticipants).toBe(2);
  });

  test('GET /reports/workshop-history retorna oficinas ordenadas', async () => {
    await seedData();
    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-prof' });

    const response = await request(app)
      .get('/reports/workshop-history')
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
