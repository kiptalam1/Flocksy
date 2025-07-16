import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	createComment,
	deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", authenticateUser, createComment);
router.delete("/:id", authenticateUser, deleteComment);
export default router;
