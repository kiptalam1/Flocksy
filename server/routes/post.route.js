import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	createPost,
	getAllPosts,
	deletePost,
	getASinglePost,
} from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, upload.single("image"), createPost);
router.get("/all", authenticateUser, getAllPosts);
router.delete("/:id", authenticateUser, deletePost);
router.get("/:id", authenticateUser, getASinglePost);

export default router;
