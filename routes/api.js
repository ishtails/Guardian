import { Router } from "express";
import { createUser, getUser } from "../controllers/common.js";

const router = Router();

// Create New User
router.post("/register", createUser);

// Get User Details
router.get("/user/:id",  getUser);

export default router;
