import { Router } from "express";
import {
  registerUser,
  getUser,
  updateUser,
  loginUser,
} from "../controllers/common.js";
import {
  closedEntries,
  openEntries,
  getStudents,
  studentOnSearch,
  closeEntry,
} from "../controllers/security.js";
import { closeGateEntry, isOutside, openGateEntry } from "../controllers/students.js";
import { verifyLocation, requireAuth } from "../middlewares/middlewares.js";
import { studentOutings } from "../controllers/admin.js";

const router = Router();

// POST
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/exit-request/:username", openGateEntry);
router.post("/entry-request/:username", closeGateEntry);

// GET
router.get("/users/:username", getUser);
router.get("/students", getStudents); //With Queries
router.get("/students/open", openEntries);
router.get("/students/closed", closedEntries);
router.get("/students/search", studentOnSearch); //With Queries
router.get("/close-entry/:username", closeEntry);
router.get("/student/outing-status/:username", isOutside);

router.get("/all-students", studentOutings);

//PATCH
router.patch("/users/:username", updateUser);

export default router;
