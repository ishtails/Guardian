import { Router } from "express";
import { registerUser, getUser } from "../controllers/common.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Get a user by email
router.get("/users/:email",  getUser);

export default router;
