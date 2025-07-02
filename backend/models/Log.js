import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

const LogModel = mongoose.models.Log || mongoose.model("Log", logSchema);

export default LogModel;
