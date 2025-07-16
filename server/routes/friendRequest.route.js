import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import {
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	cancelFriendRequest,
	unfriendUser,
	getIncomingRequests,
	getOutgoingRequests,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/request/:userId", authenticateUser, sendFriendRequest);
router.patch(
	"/request/:requestId/accept",
	authenticateUser,
	acceptFriendRequest
);
router.patch("/request/:id/decline", authenticateUser, declineFriendRequest);
router.delete("/request/:id/cancel", authenticateUser, cancelFriendRequest);
router.delete("/unfriend/:userId", authenticateUser, unfriendUser);
router.get("/incoming", authenticateUser, getIncomingRequests);
router.get("/outgoing", authenticateUser, getOutgoingRequests);

export default router;
