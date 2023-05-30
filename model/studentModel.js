import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: [true, "Provide Roll Number"],
    unique: [true, "Already Exists"],
  },
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
  outings: {
    type : Array , "default" : []
  },
  name: String,
  role: String,
  mobile: Number,
});

export default mongoose.model.Students || mongoose.model('Student', StudentSchema)