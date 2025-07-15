import express from "express";

// functions;
import authenticateUser from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllUsers);

export default router;
