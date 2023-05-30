import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
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

export default mongoose.model.Admins || mongoose.model('Admin', AdminSchema)