import { Router } from "express";
import { verifyOutingChecks, requireAuth, generateOTP, sendEmail, verifyOTP } from "../middlewares/middlewares.js";
import {
  registerStudent,
  getCurrentUser,
  updateUser,
  loginUser,
  getOutings,
  logOut
} from "../controllers/common.js";
import {
  searchStudents,
  closeGateEntry,
} from "../controllers/security.js";
import {
  isOutside,
  openGateEntry,
} from "../controllers/students.js";

const router = Router();

// COMMON
router.post("/login", loginUser);
router.get("/profile", requireAuth, getCurrentUser);
router.patch("/update-profile",requireAuth, updateUser);
router.get("/outings", getOutings);
router.get('/logout',requireAuth, logOut);

// STUDENTS
router.post("/register", registerStudent);
router.post("/student/exit-request", requireAuth, verifyOutingChecks, openGateEntry);
router.get("/student/outing-status", requireAuth, isOutside);

// ADMIN & SECURITY
router.get("/search", searchStudents); 
router.get("/security/close-entry/:username", closeGateEntry);

// TESTING
router.post("/send-email", sendEmail);

export default router;