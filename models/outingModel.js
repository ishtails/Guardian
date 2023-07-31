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
  }, { expireAfterSeconds: 90*24*60*60}
);

export default mongoose.model.outings || mongoose.model("outing", outingSchema);
