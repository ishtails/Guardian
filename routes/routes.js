import { Router } from "express";
import { createUser } from "../controllers/users.js";

const router = Router();

// Create New User
router.post("/register", createUser);

export default router;
