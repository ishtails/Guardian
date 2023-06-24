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
      default: Date.now,
    },
    inTime: {
      type: Date,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
);

export default mongoose.model.outings || mongoose.model("outing", outingSchema);
