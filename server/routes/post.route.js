import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	createPost,
	getAllPosts,
	deletePost,
	getASinglePost,
	getUserPosts,
} from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, upload.single("image"), createPost);
router.get("/all", authenticateUser, getAllPosts);
router.get("/post/:postId", authenticateUser, getASinglePost);
router.delete("/post/:id", authenticateUser, deletePost);
router.get("/user/:userId", authenticateUser, getUserPosts);


export default router;
