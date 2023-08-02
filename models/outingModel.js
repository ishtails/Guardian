import mongoose from "mongoose";

const outingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Provide Username"],
    },
    gender: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      required: [true, "Provide Reason"],
    },
    outTime: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 90,
    },
    inTime: {
      type: Date,
      default: null,
    },
    lateBy: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  }, 
);

outingSchema.index({ outTime: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
export default mongoose.model.outings || mongoose.model("outing", outingSchema);
