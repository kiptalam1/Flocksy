import express from "express";

// functions;
import upload from "../middleware/upload.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js";
import {
	getAllUsers,
	getMyProfile,
	getAnotherUserProfile,
	searchUsers,
	updateProfileInfo,
	updateProfileOrCoverImage,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllUsers);
router.get("/me", authenticateUser, getMyProfile);
router.get("/user/:id", authenticateUser, getAnotherUserProfile);
router.get("/search", authenticateUser, searchUsers);
router.patch("/profile/update", authenticateUser, updateProfileInfo);
router.patch(
	"/upload-image",
	authenticateUser,
	upload.single("image"),
	updateProfileOrCoverImage
);




export default router;
