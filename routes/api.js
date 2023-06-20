import { Router } from "express";
import {
  registerUser,
  getUser,
  getStudents,
  updateUser,
  loginUser,
} from "../controllers/common.js";
import { openGateEntry } from "../controllers/students.js";
import { openEntries } from "../controllers/security.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// POST
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/student/:username/exit-request", openGateEntry);

// GET
router.get("/users/:username", authenticate, getUser);
router.get("/students", getStudents);
router.get("/students/open", openEntries);

//PATCH
router.patch("/users/:username", updateUser);

export default router;
