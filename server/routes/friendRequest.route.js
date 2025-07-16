import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import { sendFriendRequest } from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/request/:userId", authenticateUser, sendFriendRequest);

export default router;
