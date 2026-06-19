import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, '../seed-data.json');

export function readSeedData() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
}

export async function finalizeWorkshop(workshopId) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/oficina02-e2e';
  await mongoose.connect(uri);

  const workshopSchema = new mongoose.Schema({ status: String });
  const Workshop = mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);

  await Workshop.findByIdAndUpdate(workshopId, { status: 'finalizada' });
  await mongoose.disconnect();
}
