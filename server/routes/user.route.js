import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import { getAllUsers, getMyProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllUsers);
router.get("/me", authenticateUser, getMyProfile);




export default router;
