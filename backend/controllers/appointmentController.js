import Appointment from "../models/appointmentModel.js";
import User from "../models/user.js";
// import logger from "../utils/logger.js"; // Uncomment if using winston or similar logger

// ------------------ STUDENT FUNCTIONS ------------------

// Book a new appointment (Student)
export const bookAppointment = async (req, res) => {
  try {
    const { studentId, teacherId, purpose } = req.body;

    if (!studentId || !teacherId || !purpose) {
      console.log("Missing fields:", {
        studentId,
        teacherId,

        purpose,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await User.findById(studentId);
    const teacher = await User.findById(teacherId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const newAppointment = new Appointment({
      student: studentId,
      teacher: teacherId,

      purpose,
    });

    await newAppointment.save();

    // logger.info(`Appointment booked by student: ${studentId}`);
    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    // logger.error("Error booking appointment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get appointments by student ID
export const getStudentAppointments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const appointments = await Appointment.find({ student: studentId })
      .populate("teacher", "username email subject")
      .sort({ dateTime: -1 });
    console.log(appointments);
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching student appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ TEACHER FUNCTIONS ------------------

// Approve or cancel an appointment
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // logger.info(`Appointment ${appointmentId} updated to ${status}`);
    res.json({ message: "Appointment status updated", appointment: updated });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get appointments by teacher ID
export const getTeacherAppointments = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const appointments = await Appointment.find({ teacher: teacherId })
      .populate("student", "username email")
      .sort({ dateTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching teacher appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ COMMON / ADMIN FUNCTIONS ------------------

// Get all appointments (Admin or Teacher)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("student", "username email")
      .populate("teacher", "username email subject")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update appointment dateTime (and optionally set status to "scheduled")
export const updateAppointmentDateTime = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { dateTime } = req.body;

    if (!dateTime) {
      return res.status(400).json({ message: "dateTime is required" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { dateTime },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment date/time updated",
      appointment: updated,
    });
  } catch (error) {
    console.error("Error updating appointment date/time:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
