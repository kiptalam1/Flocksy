import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	sendFriendRequest,
	acceptFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/request/:userId", authenticateUser, sendFriendRequest);
router.patch(
	"/request/:requestId/accept",
	authenticateUser,
	acceptFriendRequest
);

export default router;
