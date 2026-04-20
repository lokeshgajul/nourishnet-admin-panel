import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    donorName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String },
    profileImage: { type: String },
    status: { type: String, default: "ACTIVE" },
    suspendedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
