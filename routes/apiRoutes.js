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
  closeGateEntry,
} from "../controllers/security.js";
import { openGateEntry } from "../controllers/students.js";

const router = Router();

// POST
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/exit-request/:username", openGateEntry);

// GET
router.get("/users/:username", getUser);
router.get("/students", getStudents); //With Queries
router.get("/students/open", openEntries);
router.get("/students/closed", closedEntries);
router.get("/students/search", studentOnSearch); //With Queries
router.get("/close/:username", closeGateEntry);

//PATCH
router.patch("/users/:username", updateUser);

export default router;
