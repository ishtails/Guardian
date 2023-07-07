import { Router } from "express";
import { verifyOutingChecks, requireAuth } from "../helpers/middlewares.js";
import {
  getCurrentUser,
  updateUser,
  getOutings,
  logOut,
} from "../controllers/common.js";
import { searchStudents, closeGateEntry } from "../controllers/security.js";
import { isOutside, openGateEntry } from "../controllers/students.js";
import {
  loginUser,
  resetPassword,
  sendOTP,
  verifyOTP,
  isRegistered,
  registerStudent,
} from "../controllers/auth.js";
import { upload } from "../helpers/helpers.js";
const router = Router();

// AUTH
router.post("/login", loginUser);
router.post("/is-registered", isRegistered);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-student", registerStudent);
router.post("/reset-password", resetPassword);

// COMMON
router.get("/profile", requireAuth, getCurrentUser);
router.get("/outings", requireAuth, getOutings);
router.patch("/update-profile", requireAuth, upload.single('idCard'), updateUser);
router.get("/logout", requireAuth, logOut);

// SECURITY
router.get("/search", requireAuth, searchStudents);
router.get("/security/close-entry/:username", requireAuth, closeGateEntry);

// STUDENTS
router.post(
  "/student/exit-request",
  requireAuth,
  verifyOutingChecks,
  openGateEntry
);
router.get("/student/outing-status", requireAuth, isOutside);

export default router;
