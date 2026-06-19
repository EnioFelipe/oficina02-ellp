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
const { default: Enrollment } = await import('../src/models/Enrollment.js');

const VALID_CPF = '111.444.777-35';
const OTHER_CPF = '529.982.247-25';

async function createProfessor() {
  return User.create({ name: 'Ana', email: 'ana@example.com', type: 'professor', firebaseUid: 'uid-prof' });
}

async function createWorkshop(status = 'ativa') {
  const professor = await createProfessor();
  return Workshop.create({
    name: 'Logica',
    description: 'Oficina de logica',
    date: new Date('2026-08-01'),
    workload: 8,
    professor: professor._id,
    status
  });
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

describe('POST /enrollments', () => {
  test('cria inscricao em oficina ativa', async () => {
    const workshop = await createWorkshop('ativa');

    const response = await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    expect(response.status).toBe(201);
    expect(response.body.cpf).toBe('11144477735');
    expect(await Enrollment.countDocuments()).toBe(1);
  });

  test('bloqueia inscricao em oficina finalizada (422)', async () => {
    const workshop = await createWorkshop('finalizada');

    const response = await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    expect(response.status).toBe(422);
    expect(await Enrollment.countDocuments()).toBe(0);
  });

  test('impede CPF duplicado na mesma oficina (409)', async () => {
    const workshop = await createWorkshop('ativa');
    const payload = { name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() };

    await request(app).post('/enrollments').send(payload);
    const response = await request(app).post('/enrollments').send(payload);

    expect(response.status).toBe(409);
    expect(await Enrollment.countDocuments()).toBe(1);
  });

  test('rejeita CPF invalido (422)', async () => {
    const workshop = await createWorkshop('ativa');

    const response = await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: '11111111111', workshop: workshop._id.toString() });

    expect(response.status).toBe(422);
  });

  test('rejeita inscricao sem nome (422)', async () => {
    const workshop = await createWorkshop('ativa');

    const response = await request(app)
      .post('/enrollments')
      .send({ name: '', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    expect(response.status).toBe(422);
  });
});

describe('GET /enrollments/cpf/:cpf', () => {
  test('retorna inscricoes do CPF informado', async () => {
    const workshop = await createWorkshop('ativa');
    await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    const response = await request(app).get(`/enrollments/cpf/${OTHER_CPF}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);

    const found = await request(app).get(`/enrollments/cpf/${VALID_CPF}`);
    expect(found.status).toBe(200);
    expect(found.body).toHaveLength(1);
    expect(found.body[0].certificateAvailable).toBe(false);
  });

  test('indica certificado disponivel para oficina finalizada', async () => {
    const workshop = await createWorkshop('ativa');
    await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    await Workshop.findByIdAndUpdate(workshop._id, { status: 'finalizada' });

    const response = await request(app).get(`/enrollments/cpf/${VALID_CPF}`);

    expect(response.status).toBe(200);
    expect(response.body[0].certificateAvailable).toBe(true);
  });
});

describe('GET /enrollments/workshop/:workshopId', () => {
  test('exige autenticacao (401)', async () => {
    const workshop = await createWorkshop('ativa');
    const response = await request(app).get(`/enrollments/workshop/${workshop._id}`);
    expect(response.status).toBe(401);
  });

  test('lista inscritos para professor autenticado', async () => {
    const workshop = await createWorkshop('ativa');
    const created = await request(app)
      .post('/enrollments')
      .send({ name: 'Joao', age: 20, cpf: VALID_CPF, workshop: workshop._id.toString() });

    expect(created.status).toBe(201);

    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-prof' });

    const response = await request(app)
      .get(`/enrollments/workshop/${workshop._id}`)
      .set('Authorization', 'Bearer token-valido');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Joao');
  });
});
