import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

async function ensureUniqueUser({ email, firebaseUid }) {
  const checks = [];
  if (email) checks.push({ email });
  if (firebaseUid) checks.push({ firebaseUid });
  if (!checks.length) return;

  const duplicated = await User.findOne({ $or: checks });
  if (duplicated) {
    throw new HttpError(409, 'E-mail ou UID do Firebase ja cadastrado');
  }
}

export async function createUser(data) {
  await ensureUniqueUser(data);
  return User.create(data);
}
