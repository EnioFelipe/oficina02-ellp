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

async function seedUsers() {
  const professor = await User.create({
    name: 'Ana Professora',
    email: 'ana@example.com',
    type: 'professor',
    firebaseUid: 'uid-prof'
  });
  const tutor = await User.create({
    name: 'Tito Tutor',
    email: 'tito@example.com',
    type: 'tutor',
    firebaseUid: 'uid-tutor'
  });
  return { professor, tutor };
}

function authAs(uid, token) {
  verifyIdTokenMock.mockResolvedValue({ uid });
  return {
    get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    put: (url) => request(app).put(url).set('Authorization', `Bearer ${token}`),
    delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`)
  };
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

describe('GET /health', () => {
  test('retorna status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('POST /users', () => {
  test('cria usuario com dados validos', async () => {
    const payload = {
      name: 'Ana Professora',
      email: 'ana@example.com',
      type: 'professor',
      firebaseUid: 'firebase-uid-1'
    };

    const response = await request(app).post('/users').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(payload.email);
    expect(await User.countDocuments()).toBe(1);
  });

  test.each([
    ['nome vazio', { name: '', email: 'ana@example.com', type: 'professor', firebaseUid: 'uid-1' }],
    ['email invalido', { name: 'Ana', email: 'email-invalido', type: 'professor', firebaseUid: 'uid-1' }],
    ['tipo invalido', { name: 'Ana', email: 'ana@example.com', type: 'aluno', firebaseUid: 'uid-1' }],
    ['uid ausente', { name: 'Ana', email: 'ana@example.com', type: 'professor' }]
  ])('rejeita cadastro com %s', async (_scenario, payload) => {
    const response = await request(app).post('/users').send(payload);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('Dados invalidos');
    expect(await User.countDocuments()).toBe(0);
  });

  test('rejeita email ou firebaseUid duplicado (409)', async () => {
    await request(app).post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      type: 'professor',
      firebaseUid: 'uid-1'
    });

    const response = await request(app).post('/users').send({
      name: 'Ana 2',
      email: 'ana@example.com',
      type: 'tutor',
      firebaseUid: 'uid-2'
    });

    expect(response.status).toBe(409);
    expect(await User.countDocuments()).toBe(1);
  });
});

describe('rotas protegidas de usuarios', () => {
  test.each([
    ['GET', '/users'],
    ['GET', '/users/me'],
    ['PUT', '/users/user-1'],
    ['DELETE', '/users/user-1']
  ])('%s %s rejeita requisicao sem token', async (method, path) => {
    const response = await request(app)[method.toLowerCase()](path).send({
      name: 'Ana',
      email: 'ana@example.com',
      type: 'professor'
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token Firebase nao informado');
  });

  test('rejeita token Firebase invalido ou expirado', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('invalid token'));

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer token-invalido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token Firebase invalido ou expirado');
  });

  test('rejeita token valido sem perfil cadastrado', async () => {
    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-inexistente' });

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario nao cadastrado no sistema');
  });

  test('GET /users/me retorna perfil autenticado', async () => {
    const { professor } = await seedUsers();

    const response = await authAs('uid-prof', 'token-prof').get('/users/me');

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(professor._id.toString());
    expect(response.body.email).toBe('ana@example.com');
  });

  test('GET /users lista usuarios com filtro por tipo', async () => {
    await seedUsers();

    const response = await authAs('uid-prof', 'token-prof').get('/users?type=tutor');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Tito Tutor');
  });

  test('GET /users filtra por busca de nome', async () => {
    await seedUsers();

    const response = await authAs('uid-prof', 'token-prof').get('/users?search=Ana');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].type).toBe('professor');
  });

  test('GET /users/:id retorna detalhe do usuario', async () => {
    const { tutor } = await seedUsers();

    const response = await authAs('uid-tutor', 'token-tutor').get(`/users/${tutor._id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('tito@example.com');
  });

  test('GET /users/:id inexistente retorna 404', async () => {
    await seedUsers();

    const response = await authAs('uid-prof', 'token-prof').get('/users/64b7f0000000000000000000');

    expect(response.status).toBe(404);
  });

  test('PUT /users/:id atualiza usuario como professor', async () => {
    const { tutor } = await seedUsers();

    const response = await authAs('uid-prof', 'token-prof')
      .put(`/users/${tutor._id}`)
      .send({ name: 'Tito Atualizado', email: 'tito@example.com', type: 'tutor' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Tito Atualizado');
  });

  test('DELETE /users/:id remove usuario como professor', async () => {
    const { tutor } = await seedUsers();

    const response = await authAs('uid-prof', 'token-prof').delete(`/users/${tutor._id}`);

    expect(response.status).toBe(204);
    expect(await User.countDocuments()).toBe(1);
  });

  test.each([
    ['PUT', 'put'],
    ['DELETE', 'delete']
  ])('%s bloqueia tutor em rota exclusiva de professor', async (_label, method) => {
    const { tutor } = await seedUsers();
    const client = authAs('uid-tutor', 'token-tutor');

    const response = await client[method](`/users/${tutor._id}`)
      .send({ name: 'Tito', email: 'tito@example.com', type: 'tutor' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Acesso negado para este perfil');
  });
});
