import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    department: { type: String },
    subject: { type: String },
    isApproved: { type: Boolean, default: false }, // for student approval
  },
  { timestamps: true }
);

const user = mongoose.models.User || mongoose.model("User", userSchema);

export default user;
