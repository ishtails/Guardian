import mongoose from "mongoose";

const outingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Provide Username"],
    },
    reason: {
      type: String,
      required: [true, "Provide Reason"],
    },
    outTime: {
      type: Date,
      required: [true, "Provide outTime"],
    },
    inTime: {
      type: Date,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model.outings || mongoose.model("outing", outingSchema);
