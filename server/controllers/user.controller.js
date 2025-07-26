import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { cloudinary } from "../utils/cloudinary.util.js";
import FriendRequest from "../models/friendRequest.model.js";

export async function getAllUsers(req, res) {
	const currentUserId = req.user.userId;

	try {
		const users = await User.find({ _id: { $ne: currentUserId } }).select(
			"-password"
		);

		const updatedUsers = await Promise.all(
			users.map(async (user) => {
				let requestStatus = "none";

				// check if they are already friends
				if (user.friends.includes(currentUserId)) {
					requestStatus = "accepted";
				} else {
					const existing = await FriendRequest.findOne({
						$or: [
							{ sender: currentUserId, receiver: user._id },
							{ sender: user._id, receiver: currentUserId },
						],
					});

					if (existing) {
						if (existing.sender.toString() === currentUserId) {
							requestStatus = "pending";
						} else {
							requestStatus = "incoming";
						}

						// return early if request exists to include requestId
						return {
							...user.toObject(),
							requestStatus,
							requestId: existing._id, // ✅ include request ID
						};
					}
				}

				// fallback if no friend request exists
				return {
					...user.toObject(),
					requestStatus,
				};
			})
		);

		return res.status(200).json({ users: updatedUsers });
	} catch (error) {
		console.error("Error fetching all users", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function getMyProfile(req, res) {
	const userId = req.user.userId;

	try {
		const user = await User.findById(userId).populate().select("-password");
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

export async function updateProfileInfo(req, res) {
	const userId = req.user.userId;
	const { firstName, lastName, email, gender, currentPassword, newPassword } =
		req.body;

	try {
		if (!currentPassword)
			return res.status(400).json({ error: "Current password is required." });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found." });

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch)
			return res.status(400).json({ error: "Incorrect current password." });

		// Prepare update object
		const updates = {};
		if (firstName) updates.firstName = firstName;
		if (lastName) updates.lastName = lastName;
		if (email) updates.email = email;
		if (gender) updates.gender = gender;

		if (newPassword) {
			if (newPassword.length < 6) {
				return res
					.status(400)
					.json({ error: "New password must be at least 6 characters long." });
			}
			const salt = await bcrypt.genSalt(10);
			updates.password = await bcrypt.hash(newPassword, salt);
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
		}).select("-password");

		return res
			.status(200)
			.json({ user: updatedUser, message: "Profile updated successfully." });
	} catch (error) {
		console.error("Error updating profile:", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function updateProfileOrCoverImage(req, res) {
	try {
		const userId = req.user?.userId;
		if (!userId) return res.status(401).json({ error: "Unauthorized" });

		const { imageType } = req.body;

		if (!req.file) return res.status(400).json({ error: "No image uploaded." });

		if (!["profile", "cover"].includes(imageType))
			return res.status(400).json({ error: "Invalid image type." });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found." });

		const newImageUrl = req.file.path;
		let oldImageUrl;

		if (imageType === "profile") {
			oldImageUrl = user.profileImage;
			user.profileImage = newImageUrl;
		} else {
			oldImageUrl = user.coverImage;
			user.coverImage = newImageUrl;
		}

		await user.save();

		res.status(200).json({
			message: `${imageType} image updated`,
			imageUrl: newImageUrl,
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				gender: user.gender,
				friends: user.friends,
				createdAt: user.createdAt,
				profileImage: user.profileImage,
				coverImage: user.coverImage,
			},
		});

		// Cleanup (non-blocking)
		if (oldImageUrl) {
			const parts = oldImageUrl.split("/");
			const filename = parts.pop().split(".")[0];
			const folder = parts.slice(-1)[0];
			const publicId = `${folder}/${filename}`;
			cloudinary.uploader
				.destroy(publicId)
				.catch((err) =>
					console.error("Cloudinary deletion error:", err.message)
				);
		}
	} catch (err) {
		console.error("Image upload error:", err.stack || err.message);
		res.status(500).json({
			error: "Server error while uploading image",
			details: err.message,
		});
	}
}


export async function fetchUserFriends(req, res) {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId).select("friends");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const friends = await User.find({ _id: { $in: user.friends } }).select(
			"firstName lastName profileImage"
		);

		return res.status(200).json({ friends });
	} catch (error) {
		console.error("Error fetching friends:", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
