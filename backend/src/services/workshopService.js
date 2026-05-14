import User from '../models/User.js';
import Workshop from '../models/Workshop.js';
import { HttpError } from '../utils/httpError.js';

const populateFields = [
  { path: 'professor', select: 'name email type' },
  { path: 'tutors', select: 'name email type' }
];

export async function listWorkshops(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') }
    ];
  }

  const sortMap = {
    name: { name: 1 },
    dateAsc: { date: 1 },
    dateDesc: { date: -1 }
  };

  return Workshop.find(query)
    .populate(populateFields)
    .sort(sortMap[filters.sort] || { date: -1 });
}

export async function getWorkshopById(id) {
  const workshop = await Workshop.findById(id).populate(populateFields);
  if (!workshop) throw new HttpError(404, 'Oficina nao encontrada');
  return workshop;
}

export async function createWorkshop(data) {
  const responsible = await User.findOne({ _id: data.professor, type: { $in: ['professor', 'tutor'] } });
  if (!responsible) throw new HttpError(422, 'Responsavel invalido');

  return Workshop.create(data);
}

export async function updateWorkshop(id, data) {
  await getWorkshopById(id);

  if (data.professor) {
    const responsible = await User.findOne({ _id: data.professor, type: { $in: ['professor', 'tutor'] } });
    if (!responsible) throw new HttpError(422, 'Responsavel invalido');
  }

  return Workshop.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(populateFields);
}

export async function deleteWorkshop(id) {
  const deleted = await Workshop.findByIdAndDelete(id);
  if (!deleted) throw new HttpError(404, 'Oficina nao encontrada');
  return deleted;
}

export async function addParticipant(workshopId, participantId, role) {
  const field = 'tutors';
  const user = await User.findOne({ _id: participantId, type: role });

  if (!user) throw new HttpError(422, `Participante precisa ser do tipo ${role}`);

  const workshop = await Workshop.findById(workshopId);
  if (!workshop) throw new HttpError(404, 'Oficina nao encontrada');

  if (workshop[field].some((id) => id.toString() === participantId)) {
    throw new HttpError(409, 'Participante ja vinculado a oficina');
  }

  workshop[field].push(participantId);
  await workshop.save();
  return getWorkshopById(workshopId);
}

export async function removeParticipant(workshopId, participantId, role) {
  const field = 'tutors';
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) throw new HttpError(404, 'Oficina nao encontrada');

  workshop[field] = workshop[field].filter((id) => id.toString() !== participantId);
  await workshop.save();
  return getWorkshopById(workshopId);
}
