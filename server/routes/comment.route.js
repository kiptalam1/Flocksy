import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", authenticateUser, createComment);

export default router;
