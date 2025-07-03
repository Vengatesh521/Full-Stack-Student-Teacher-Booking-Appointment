import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: { type: Date, required: false },
    purpose: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const appointmentModel =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
