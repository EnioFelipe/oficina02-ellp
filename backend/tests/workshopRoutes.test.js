import { jest } from '@jest/globals';
import request from 'supertest';
import { clearDb, closeMemoryDb, connectMemoryDb } from './helpers/db.js';
import { clearRateLimitBuckets } from '../src/middlewares/rateLimitByIp.js';

const verifyIdTokenMock = jest.fn();

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken: verifyIdTokenMock }) }
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const { default: Workshop } = await import('../src/models/Workshop.js');

async function createProfessor() {
  return User.create({ name: 'Ana', email: 'ana@example.com', type: 'professor', firebaseUid: 'uid-prof' });
}

function authed() {
  verifyIdTokenMock.mockResolvedValue({ uid: 'uid-prof' });
  return request(app);
}

beforeAll(async () => {
  await connectMemoryDb();
});

afterAll(async () => {
  await closeMemoryDb();
});

afterEach(async () => {
  await clearDb();
  clearRateLimitBuckets();
  jest.clearAllMocks();
});

describe('rotas publicas de oficinas', () => {
  test('GET /workshops lista oficinas', async () => {
    const professor = await createProfessor();
    await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id });

    const response = await request(app).get('/workshops');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /workshops/:id retorna oficina existente', async () => {
    const professor = await createProfessor();
    const workshop = await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id });

    const response = await request(app).get(`/workshops/${workshop._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Logica');
  });

  test('GET /workshops/:id inexistente retorna 404', async () => {
    const response = await request(app).get('/workshops/64b7f0000000000000000000');
    expect(response.status).toBe(404);
  });
});

describe('rotas protegidas de oficinas', () => {
  test('POST /workshops exige autenticacao (401)', async () => {
    const response = await request(app).post('/workshops').send({ name: 'X' });
    expect(response.status).toBe(401);
  });

  test('POST /workshops cria oficina com dados validos', async () => {
    const professor = await createProfessor();

    const response = await authed()
      .post('/workshops')
      .set('Authorization', 'Bearer token-valido')
      .send({ name: 'Logica', description: 'd', date: '2026-08-01', workload: 8, professor: professor._id.toString() });

    expect(response.status).toBe(201);
    expect(await Workshop.countDocuments()).toBe(1);
  });

  test('POST /workshops rejeita dados invalidos (422)', async () => {
    await createProfessor();

    const response = await authed()
      .post('/workshops')
      .set('Authorization', 'Bearer token-valido')
      .send({ name: '', description: '', date: 'data-ruim', workload: 0, professor: 'nao-eh-id' });

    expect(response.status).toBe(422);
  });

  test('PUT /workshops/:id atualiza oficina', async () => {
    const professor = await createProfessor();
    const workshop = await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id });

    const response = await authed()
      .put(`/workshops/${workshop._id}`)
      .set('Authorization', 'Bearer token-valido')
      .send({
        name: 'Logica Avancada',
        description: 'Nova descricao',
        date: '2026-09-01',
        workload: 12,
        professor: professor._id.toString(),
        status: 'finalizada'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Logica Avancada');
    expect(response.body.status).toBe('finalizada');
  });

  test('impede vincular tutor duplicado (409)', async () => {
    const professor = await createProfessor();
    const tutor = await User.create({ name: 'Tito', email: 'tito@example.com', type: 'tutor', firebaseUid: 'uid-tutor' });
    const workshop = await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id, tutors: [tutor._id] });

    const response = await authed()
      .post(`/workshops/${workshop._id}/tutors`)
      .set('Authorization', 'Bearer token-valido')
      .send({ participantId: tutor._id.toString() });

    expect(response.status).toBe(409);
  });

  test('vincula e remove tutor de uma oficina', async () => {
    const professor = await createProfessor();
    const tutor = await User.create({ name: 'Tito', email: 'tito@example.com', type: 'tutor', firebaseUid: 'uid-tutor' });
    const workshop = await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id });

    const added = await authed()
      .post(`/workshops/${workshop._id}/tutors`)
      .set('Authorization', 'Bearer token-valido')
      .send({ participantId: tutor._id.toString() });

    expect(added.status).toBe(200);
    expect(added.body.tutors).toHaveLength(1);

    const removed = await authed()
      .delete(`/workshops/${workshop._id}/tutors/${tutor._id}`)
      .set('Authorization', 'Bearer token-valido');

    expect(removed.status).toBe(200);
    expect(removed.body.tutors).toHaveLength(0);
  });

  test('DELETE /workshops/:id remove oficina', async () => {
    const professor = await createProfessor();
    const workshop = await Workshop.create({ name: 'Logica', description: 'd', date: new Date('2026-08-01'), workload: 8, professor: professor._id });

    const response = await authed()
      .delete(`/workshops/${workshop._id}`)
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(204);
    expect(await Workshop.countDocuments()).toBe(0);
  });
});
