import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Provide Institute Email"],
      unique: [true, "Email already exists"],
    },

    username: {
      type: String,
      required: [true, "Provide Username"],
      unique: [true, "Username already exists"],
    },

    password: {
      type: String,
      required: [true, "Provide password"],
    },

    role: {
      type: String,
      required: [true, "Provide role"],
    },

    name: {
      type: String,
      default: "",
    },

    gender: {
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

    profilePic: {
      type: String,
      default: "",
    },

    idCard: {
      type: String,
      default: "",
    }
  },
  { timestamps: true, expireAfterSeconds: 5*365*24*60*60 }
);

export default mongoose.model.users || mongoose.model("user", userSchema);
