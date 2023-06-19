import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Provide Institute Email"],
    unique: [true, "Already Exists"],
  },

  password: {
    type: String,
    required: [true, "Provide Password"],
  },

  role: {
    type: String,
    required: [true, "Provide Role"],
  },

  name: {
    type: String,
    default: "",
  },

  mobile: {
    type: Number,
    default: "",
  },

  hostel: {
    type: String,
    default: "",
  },
  
  room: {
    type: Number,
    default: "",
  },
});

export default mongoose.model.users || mongoose.model("user", userSchema);
