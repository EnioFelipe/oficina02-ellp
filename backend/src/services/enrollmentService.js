import Enrollment from '../models/Enrollment.js';
import Workshop from '../models/Workshop.js';
import { sanitizeCpf } from '../utils/cpf.js';
import { HttpError } from '../utils/httpError.js';

export async function createEnrollment(data) {
  const cpf = sanitizeCpf(data.cpf);
  const workshop = await Workshop.findById(data.workshop);

  if (!workshop) throw new HttpError(404, 'Oficina nao encontrada');
  if (workshop.status !== 'ativa') throw new HttpError(422, 'Esta oficina nao esta aberta para inscricoes');

  const exists = await Enrollment.findOne({ cpf, workshop: data.workshop });
  if (exists) throw new HttpError(409, 'CPF ja inscrito nesta oficina');

  return Enrollment.create({
    name: data.name,
    age: data.age,
    cpf,
    workshop: data.workshop
  });
}

export async function findEnrollmentsByCpf(cpf) {
  const sanitizedCpf = sanitizeCpf(cpf);
  const enrollments = await Enrollment.find({ cpf: sanitizedCpf })
    .populate({
      path: 'workshop',
      populate: { path: 'professor', select: 'name email type' }
    })
    .sort({ createdAt: -1 });

  return enrollments.map((enrollment) => ({
    id: enrollment._id,
    name: enrollment.name,
    age: enrollment.age,
    cpf: enrollment.cpf,
    workshop: enrollment.workshop,
    certificateAvailable: enrollment.workshop?.status === 'finalizada'
  }));
}

export async function findEnrollmentsByWorkshop(workshopId) {
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) throw new HttpError(404, 'Oficina nao encontrada');

  return Enrollment.find({ workshop: workshopId })
    .select('name age cpf createdAt workshop')
    .sort({ name: 1 });
}

export async function getEnrollmentForCertificate(workshopId, cpf) {
  const enrollment = await Enrollment.findOne({ workshop: workshopId, cpf: sanitizeCpf(cpf) })
    .populate({
      path: 'workshop',
      populate: { path: 'professor', select: 'name' }
    });

  if (!enrollment) throw new HttpError(404, 'Inscricao nao encontrada para este CPF');
  if (enrollment.workshop.status !== 'finalizada') {
    throw new HttpError(422, 'Certificado disponivel apenas para oficinas finalizadas');
  }

  return enrollment;
}
