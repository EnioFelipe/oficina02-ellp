import { jest } from '@jest/globals';
import request from 'supertest';
import { clearDb, closeMemoryDb, connectMemoryDb } from './helpers/db.js';

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken: jest.fn() }) }
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const { default: Workshop } = await import('../src/models/Workshop.js');
const { default: Enrollment } = await import('../src/models/Enrollment.js');

const VALID_CPF = '111.444.777-35';

async function seedEnrollment(status) {
  const professor = await User.create({ name: 'Ana', email: 'ana@example.com', type: 'professor', firebaseUid: 'uid-prof' });
  const workshop = await Workshop.create({
    name: 'Logica',
    description: 'Oficina de logica',
    date: new Date('2026-08-01'),
    workload: 8,
    professor: professor._id,
    status
  });
  await Enrollment.create({ name: 'Joao', age: 20, cpf: '11144477735', workshop: workshop._id });
  return workshop;
}

beforeAll(async () => {
  await connectMemoryDb();
});

afterAll(async () => {
  await closeMemoryDb();
});

afterEach(async () => {
  await clearDb();
});

describe('GET /certificates/:workshopId/:cpf', () => {
  test('gera PDF para inscrito em oficina finalizada', async () => {
    const workshop = await seedEnrollment('finalizada');

    const response = await request(app).get(`/certificates/${workshop._id}/${VALID_CPF}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/pdf');
    expect(response.headers['content-disposition']).toContain('certificado');
  });

  test('bloqueia certificado de oficina nao finalizada (422)', async () => {
    const workshop = await seedEnrollment('ativa');

    const response = await request(app).get(`/certificates/${workshop._id}/${VALID_CPF}`);

    expect(response.status).toBe(422);
  });

  test('retorna 404 quando nao ha inscricao para o CPF', async () => {
    const workshop = await seedEnrollment('finalizada');

    const response = await request(app).get(`/certificates/${workshop._id}/529.982.247-25`);

    expect(response.status).toBe(404);
  });

  test('rejeita CPF invalido no parametro (422)', async () => {
    const workshop = await seedEnrollment('finalizada');

    const response = await request(app).get(`/certificates/${workshop._id}/11111111111`);

    expect(response.status).toBe(422);
  });
});
