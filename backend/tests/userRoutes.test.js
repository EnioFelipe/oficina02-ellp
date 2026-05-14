import { jest } from '@jest/globals';
import request from 'supertest';

const verifyIdTokenMock = jest.fn();
const findOneMock = jest.fn();
const createMock = jest.fn();

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: {
    auth: () => ({
      verifyIdToken: verifyIdTokenMock
    })
  }
}));

jest.unstable_mockModule('../src/models/User.js', () => ({
  default: {
    findOne: findOneMock,
    create: createMock
  }
}));

jest.unstable_mockModule('../src/routes/workshopRoutes.js', () => ({
  default: (_req, _res, next) => next()
}));

const { default: app } = await import('../src/app.js');

describe('API base', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health retorna status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('POST /users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('cria um usuario com dados validos', async () => {
    const payload = {
      name: 'Ana Professora',
      email: 'ana@example.com',
      type: 'professor',
      firebaseUid: 'firebase-uid-1'
    };
    const createdUser = { _id: 'user-1', ...payload };

    findOneMock.mockResolvedValue(null);
    createMock.mockResolvedValue(createdUser);

    const response = await request(app).post('/users').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdUser);
    expect(findOneMock).toHaveBeenCalledWith({
      $or: [{ email: payload.email }, { firebaseUid: payload.firebaseUid }]
    });
    expect(createMock).toHaveBeenCalledWith(payload);
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
    expect(response.body.errors).toEqual(expect.any(Array));
    expect(createMock).not.toHaveBeenCalled();
  });

  test('rejeita usuario com email ou firebaseUid ja cadastrado', async () => {
    findOneMock.mockResolvedValue({ _id: 'existing-user' });

    const response = await request(app).post('/users').send({
      name: 'Ana Professora',
      email: 'ana@example.com',
      type: 'professor',
      firebaseUid: 'firebase-uid-1'
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('E-mail ou UID do Firebase ja cadastrado');
    expect(createMock).not.toHaveBeenCalled();
  });
});

describe('rotas protegidas de usuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(verifyIdTokenMock).not.toHaveBeenCalled();
  });

  test('rejeita token Firebase invalido ou expirado', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('invalid token'));

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer token-invalido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token Firebase invalido ou expirado');
    expect(verifyIdTokenMock).toHaveBeenCalledWith('token-invalido');
  });

  test('rejeita token valido sem perfil cadastrado no MongoDB', async () => {
    verifyIdTokenMock.mockResolvedValue({ uid: 'firebase-uid-sem-perfil' });
    findOneMock.mockResolvedValue(null);

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario nao cadastrado no sistema');
    expect(findOneMock).toHaveBeenCalledWith({ firebaseUid: 'firebase-uid-sem-perfil' });
  });

  test.each([
    ['PUT', '/users/user-1'],
    ['DELETE', '/users/user-1']
  ])('%s %s bloqueia tutor em rota exclusiva de professor', async (method, path) => {
    verifyIdTokenMock.mockResolvedValue({ uid: 'firebase-uid-tutor' });
    findOneMock.mockResolvedValue({
      _id: 'user-tutor',
      name: 'Tito Tutor',
      email: 'tito@example.com',
      type: 'tutor',
      firebaseUid: 'firebase-uid-tutor'
    });

    const response = await request(app)
      [method.toLowerCase()](path)
      .set('Authorization', 'Bearer token-valido')
      .send({
        name: 'Tito Tutor',
        email: 'tito@example.com',
        type: 'tutor'
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Acesso negado para este perfil');
  });
});
