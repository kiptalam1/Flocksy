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
				},
				{
					sender: receiverId,
					receiver: senderId,
				},
			],
			status: { $in: ["pending", "accepted"] },
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

export async function acceptFriendRequest(req, res) {
	const { requestId } = req.params;
	const userId = req.user.userId;

	try {
		// find if friend request exists;
		const request = await FriendRequest.findById(requestId);
		if (!request || request.receiver.toString() !== userId) {
			return res.status(404).json({ error: "Friend request not found." });
		}
		if (request.status !== "pending") {
			return res.status(400).json({ error: "Request already handled." });
		}

		request.status = "accepted";
		await request.save();

		// add both users as friends;
		await User.findByIdAndUpdate(request.sender, {
			$addToSet: { friends: request.receiver },
		});
		await User.findByIdAndUpdate(request.receiver, {
			$addToSet: { friends: request.sender },
		});

		return res.status(200).json({ message: "Friend request accepted." });
	} catch (error) {
		console.error("Error in accept friend request", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}