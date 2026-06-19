import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    cpf: { type: String, required: true, trim: true },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true }
  },
  { timestamps: true }
);

enrollmentSchema.index({ cpf: 1, workshop: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
