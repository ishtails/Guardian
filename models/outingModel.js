import mongoose from "mongoose";

const outingSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: [true, "Provide Roll Number"],
  },
  outTime: Date,
  inTime: Date,
  reason: String
});

export default mongoose.model.outings || mongoose.model("outing", outingSchema);