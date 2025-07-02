import express from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// Get all teacher from auth
router.get("/teachers", authController.getTeacher);
router.get("/profile", authenticate, authController.getProfile); // Add middleware here

export default router;
