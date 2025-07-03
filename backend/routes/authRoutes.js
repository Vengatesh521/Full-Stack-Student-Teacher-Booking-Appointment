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

router.get("/profile", authenticate, authController.getProfile); // Add middleware here
// routes/auth.js
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false, // true in production with HTTPS
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
