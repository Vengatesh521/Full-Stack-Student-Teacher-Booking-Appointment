import express from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// Get all teacher from auth
router.get("/teachers", authController.getTeacher);
router.get("/students", authController.getPendingStudents);
router.put("/approve-student/:id", authController.approveStudent);

router.delete("/delete-teacher/:id", authController.deleteTeacher);
router.put("/edit-teacher/:id", authController.editTeacher);

router.get("/profile", authController.getProfile); // Add middleware here
// routes/auth.js
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true, // true in production with HTTPS
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
