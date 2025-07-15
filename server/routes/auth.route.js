import express from "express";
import {
	registerUser,
	loginUser,
	logout,
} from "../controllers/auth.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);


export default router;
