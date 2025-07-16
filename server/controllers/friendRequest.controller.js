import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";

export async function sendFriendRequest(req, res) {
	const senderId = req.user.userId;
	const receiverId = req.params.userId;

	try {
		// forbid user from friending themselves;
		if (senderId === receiverId)
			return res.status(400).json({ error: "You cannot friend yourself." });

		//check if a similar request exists;
		const existing = await FriendRequest.findOne({
			$or: [
				{
					sender: senderId,
					receiver: receiverId,
					status: "pending",
				},
				{
					sender: receiverId,
					receiver: senderId,
					status: "pending",
				},
			],
		});

		if (existing) {
			return res.status(400).json({ error: "Friend request already sent." });
		}

		const newRequest = await FriendRequest.create({
			sender: senderId,
			receiver: receiverId,
		});

		return res
			.status(201)
			.json({ message: "Friend request sent.", request: newRequest });
	} catch (error) {
		console.error("Error in sendFriendRequest :", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
