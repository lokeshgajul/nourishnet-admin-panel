import mongoose from 'mongoose';

const NgoSchema = new mongoose.Schema({
  role: { type: String, default: 'Ngo' },
  ngoName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bio: { type: String },
  profileImage: { type: String },
  registrationProof: { type: String },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
    default: 'PENDING'
  },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },
  isVerified: { type: Boolean, default: false },
  password: { type: String }
}, { timestamps: true });

// Check if model exists before defining to prevent recompilation error in Next.js HMR
export default mongoose.models.Ngo || mongoose.model('Ngo', NgoSchema);
