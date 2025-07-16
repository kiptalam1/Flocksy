import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	createComment,
	deleteComment,
	likeUnlikeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", authenticateUser, createComment);
router.delete("/:id", authenticateUser, deleteComment);
router.post("/comment/:id", authenticateUser, likeUnlikeComment);
export default router;
