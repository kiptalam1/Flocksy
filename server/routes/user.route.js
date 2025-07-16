import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	getAllUsers,
	getMyProfile,
	getAnotherUserProfile,
	searchUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllUsers);
router.get("/me", authenticateUser, getMyProfile);
router.get("/user/:id", authenticateUser, getAnotherUserProfile);
router.get("/search", authenticateUser, searchUsers);





export default router;
