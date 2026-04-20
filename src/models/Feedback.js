import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
