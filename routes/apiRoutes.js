import { Router } from "express";
import {
  verifyOutingChecks,
  requireAuth,
  sendOTP,
  verifyOTP,
  isRegistered,
} from "../middlewares/middlewares.js";
import {
  registerStudent,
  getCurrentUser,
  updateUser,
  loginUser,
  getOutings,
  logOut,
  resetPassword,
  forgotPassword,
} from "../controllers/common.js";
import { searchStudents, closeGateEntry } from "../controllers/security.js";
import { isOutside, openGateEntry } from "../controllers/students.js";

const router = Router();

// GENERAL
router.post("/login", loginUser);
router.post("/is-registered", isRegistered);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-student", registerStudent);
router.post("/forgot-password", forgotPassword); //WIP

// GENERAL
router.get("/profile", requireAuth, getCurrentUser);
router.get("/outings", requireAuth, getOutings);
router.patch("/update-profile", requireAuth, updateUser);
router.post("/reset-password", requireAuth, resetPassword); //WIP
router.get("/logout", requireAuth, logOut);

// STUDENTS
router.post("/student/exit-request", requireAuth, verifyOutingChecks, openGateEntry);
router.get("/student/outing-status", requireAuth, isOutside);

// ADMIN & SECURITY
router.get("/search", requireAuth, searchStudents);
router.get("/security/close-entry/:username", requireAuth, closeGateEntry);

export default router;
