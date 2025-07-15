import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import sendToken from "../utils/sendToken.js";

export async function registerUser(req, res) {
	try {
		const { firstName, lastName, email, gender, password } = req.body;
		if (!firstName || !lastName || !email || !gender || !password) {
			return res.status(400).json({ error: "All fields are required." });
		}
		//check if the user exists;
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ error: "A user with this email exists." });

		// register the new user with a safe password;
		if (password.length < 6)
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters long" });

		//hash the password;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		//save user;
		const newUser = new User({
			firstName,
			lastName,
			email,
			gender,
			password: hashedPassword,
		});
		await newUser.save();
		newUser.password = null;

		sendToken(newUser, res, 201);
	} catch (error) {
		console.error("Error registering user", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}


export async function loginUser(req, res) {
	const { email, password } = req.body;
	try {
		//check if the email exists;
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(404)
				.json({ error: "User not found. Please try again." });

		// if user exists, check password;
		const correctPassword = await bcrypt.compare(password, user.password);
		if (!correctPassword)
			return res.status(400).json({ error: "Wrong password." });

		//else send token;
		user.password = undefined; // sanitize
		sendToken(user, res, 200);
	} catch (error) {
		console.error("Login error", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export function logout(req, res) {
	res.clearCookie("token", {
		secure: process.env.NODE_ENV === "production", // dynamic for dev;
		httpOnly: true,
		sameSite: "strict",
	});
	res.status(200).json({ message: "Logged out" });
}