import { Router } from "express";
import {
  registerUser,
  getUser,
  getStudents,
  updateUser,
} from "../controllers/common.js";
import { openGateEntry } from "../controllers/students.js";
import {
  closedEntries,
  openEntries,
  studentOnSearch,
} from "../controllers/security.js";

const router = Router();

// POST
router.post("/register", registerUser);
router.post("/student/:username/exit-request", openGateEntry);

// GET
router.get("/users/:username", getUser);
router.get("/students", getStudents);
router.get("/students/open", openEntries);
router.get("/students/closed", closedEntries);
router.get("/students/:username", studentOnSearch);

//PATCH
router.patch("/users/:username", updateUser);

export default router;
