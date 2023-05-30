import { Router } from "express";
const router = Router();

// GET
router.get("/", (req, res) => {res.send("GET /")});

// POST
router.post("/", (req, res) => {res.send("POST /")});

// PUT
router.put("/", (req, res) => {res.send("PUT /")});

export default router