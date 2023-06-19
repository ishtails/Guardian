import { Router } from "express";
import { registerUser, getUser, getStudents } from "../controllers/common.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Get a user by email
router.get("/users/:email",  getUser);

// Get all students
router.get("/students",  getStudents);

export default router;
