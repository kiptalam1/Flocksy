import User from "../models/user.model.js";

export async function getAllUsers(req, res) {
	const userId = req.user.userId;

	try {
		const users = await User.find({ _id: { $ne: userId } }).select("-password");

		return res.status(200).json({ users });
	} catch (error) {
		console.error("Error fetching all users", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
