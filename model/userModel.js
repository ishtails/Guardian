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
    required: [true, "Provide Password"],
  },
  
  rollNumber: String,
  name: String,
  mobile: Number,
  hostel: String,
  room: Number,
});

export default mongoose.model.users || mongoose.model("user", userSchema);
