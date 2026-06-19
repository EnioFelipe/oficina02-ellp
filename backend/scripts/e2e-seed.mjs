import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../../frontend/e2e/seed-data.json');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  firebaseUid: String
}, { timestamps: true });

const workshopSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  workload: Number,
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'ativa' },
  tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/oficina02-e2e';
  await mongoose.connect(uri);

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Workshop = mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);

  await User.deleteMany({ email: 'e2e-prof@example.com' });
  await Workshop.deleteMany({ name: 'Oficina E2E Certificado' });

  const professor = await User.create({
    name: 'Prof E2E',
    email: 'e2e-prof@example.com',
    type: 'professor',
    firebaseUid: 'e2e-uid-prof'
  });

  const workshop = await Workshop.create({
    name: 'Oficina E2E Certificado',
    description: 'Oficina criada para teste E2E',
    date: new Date('2026-10-01'),
    workload: 8,
    professor: professor._id,
    status: 'ativa'
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({
    workshopId: workshop._id.toString(),
    workshopName: workshop.name,
    cpf: '111.444.777-35',
    studentName: 'Aluno E2E'
  }, null, 2));

  await mongoose.disconnect();
  console.log('E2E seed ok:', outputPath);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
