import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	getAllUsers,
	getMyProfile,
	getAnotherUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllUsers);
router.get("/me", authenticateUser, getMyProfile);
router.get("/:id", authenticateUser, getAnotherUserProfile);





export default router;
