import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

//app configuration
const app = express();
const PORT = process.env.PORT || 5000;

//database connection
connectDB();

//middleware
app.use(
  cors({
    origin: [
      "https://full-stack-student-teacher-booking.onrender.com",
      "https://full-stack-student-teacher-booking-b404.onrender.com",
      "http://localhost:5173/",
    ],
    credentials: true,
  })
);

app.use(express.json()); // for parsing application/json
app.use(cookieParser());
//api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/message", messageRoutes);

//database connection

app.get("/", (req, res) => {
  res.send("Welcome to the Student-Teacher Booking Appointment API");
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

//mongodb+srv://vinex521:55555566@cluster0.vreiufw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//mongodb+srv://vinex521:55555566@cluster0.vreiufw.mongodb.net/?
//https://full-stack-student-teacher-booking.onrender.com
