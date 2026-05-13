import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ['professor', 'tutor'], required: true },
    firebaseUid: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
