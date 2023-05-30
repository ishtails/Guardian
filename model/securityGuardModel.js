import mongoose from "mongoose";

const SecurityGuardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Provide Institute Email"],
    unique: [true, "Already Exists"],
  },
  password: {
    type: String,
    required: [true, "Provide Password"],
    unique: false
  },
  name: String,
  mobile: Number,
  role: String,
});

export default mongoose.model.Guards || mongoose.model('Guard', SecurityGuardSchema)