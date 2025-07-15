import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import { createPost } from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, upload.single("image"), createPost);

export default router;
