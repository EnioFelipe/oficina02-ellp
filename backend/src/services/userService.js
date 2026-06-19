import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

async function ensureUniqueUser({ email, firebaseUid }, ignoredId) {
  const checks = [];
  if (email) checks.push({ email });
  if (firebaseUid) checks.push({ firebaseUid });
  if (!checks.length) return;

  const filter = { $or: checks };
  if (ignoredId !== undefined && ignoredId !== null) {
    filter._id = { $ne: ignoredId };
  }

  const duplicated = await User.findOne(filter);

  if (duplicated) {
    throw new HttpError(409, 'E-mail ou UID do Firebase ja cadastrado');
  }
}

export async function listUsers(filters = {}) {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { email: new RegExp(filters.search, 'i') }
    ];
  }

  return User.find(query).sort({ name: 1 });
}

export async function getUserById(id) {
  const user = await User.findById(id);
  if (!user) throw new HttpError(404, 'Usuario nao encontrado');
  return user;
}

export async function getUserByFirebaseUid(firebaseUid) {
  const user = await User.findOne({ firebaseUid });
  if (!user) throw new HttpError(404, 'Usuario nao encontrado');
  return user;
}

export async function createUser(data) {
  await ensureUniqueUser(data);
  return User.create(data);
}

export async function updateUser(id, data) {
  await getUserById(id);
  await ensureUniqueUser(data, id);
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteUser(id) {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw new HttpError(404, 'Usuario nao encontrado');
  return deleted;
}
