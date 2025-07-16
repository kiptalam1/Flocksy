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


export async function getMyProfile(req, res) {
	const userId = req.user.userId;

	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ user });
	} catch (error) {
		console.error("Error fetching my profile", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function getAnotherUserProfile(req, res) {
	const { id: userId } = req.params;
	try {
		const user = await User.findById(userId).select("-password");
		if (!user) return res.status(404).json({ error: "User not found." });

		return res.status(200).json({ user });
	} catch (error) {
		console.error("Error in getAnotherUSerProfile", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function searchUsers(req, res) {
	const { query } = req.query;
	try {
		const users = await User.find({
			$or: [
				{ firstName: { $regex: query, $options: "i" } },
				{ lastName: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			],
		}).select("-password -__v");

		return res.status(200).json({ users });
	} catch (error) {
		console.error("Error in search users function", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}