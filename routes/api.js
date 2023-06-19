import { Router } from "express";
import { registerUser, getUser, getStudents, updateUser } from "../controllers/common.js";

const router = Router();

// POST
router.post("/register", registerUser);

// GET
router.get("/users/:username",  getUser);
router.get("/students",  getStudents);

//PATCH
router.patch("/users/:username", updateUser)

export default router;
