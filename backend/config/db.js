import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://vinex521:55555566@cluster0.vreiufw.mongodb.net/Student-Teacher-Booking-Appointment"
    )
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1); // Exit the process with failure
    });
};

export default connectDB;
