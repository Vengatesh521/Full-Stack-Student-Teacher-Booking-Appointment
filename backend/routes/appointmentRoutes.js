import { Router } from "express";
import {
  bookAppointment,
  getStudentAppointments,
  getTeacherAppointments,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controllers/appointmentController.js";

const router = Router();

// Student books a new appointment
router.post("/book", bookAppointment);

// Get all appointments for a specific student
router.get("/student/:studentId", getStudentAppointments);

// Get all appointments for a specific teacher
router.get("/teacher/:teacherId", getTeacherAppointments);

// Teacher updates appointment status (approve/cancel)
router.patch("/:appointmentId/status", updateAppointmentStatus);

// Get all appointments (admin/teacher)
router.get("/", getAllAppointments);

export default router;
