import { Router } from "express";
import { registerUser, getUser, getStudents, updateUser } from "../controllers/common.js";
import { openGateEntry } from "../controllers/students.js";

const router = Router();

// POST
router.post("/register", registerUser);
router.post("/student/:username/exit-request", openGateEntry);

// GET
router.get("/users/:username", getUser);
router.get("/students", getStudents);

//PATCH
router.patch("/users/:username", updateUser);

export default router;
