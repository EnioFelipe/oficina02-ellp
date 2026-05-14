import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    workload: { type: Number, required: true, min: 1 },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['ativa', 'finalizada'], default: 'ativa' },
    tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('Workshop', workshopSchema);
