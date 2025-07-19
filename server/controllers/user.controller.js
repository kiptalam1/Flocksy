import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { cloudinary } from "../utils/cloudinary.util.js";

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
	const userId = req.user.userId;
	const { imageType } = req.body; // expects "profile" or "cover"

	if (!req.file) return res.status(400).json({ error: "No image uploaded." });

	if (!["profile", "cover"].includes(imageType))
		return res.status(400).json({ error: "Invalid image type." });

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found." });

		const currentImageUrl =
			imageType === "profile" ? user.profileImage : user.coverImage;

		// 🔥 Inline public_id extraction and Cloudinary deletion
		if (currentImageUrl) {
			const parts = currentImageUrl.split("/");
			const filename = parts.pop().split(".")[0]; // without extension
			const folder = parts.slice(-1)[0]; // last folder name
			const publicId = `${folder}/${filename}`;

			await cloudinary.uploader.destroy(publicId);
		}

		// Save new image URL
		const newImageUrl = req.file.path;
		if (imageType === "profile") {
			user.profileImage = newImageUrl;
		} else {
			user.coverImage = newImageUrl;
		}

		await user.save();
		return res
			.status(200)
			.json({ message: `${imageType} image updated`, user });
	} catch (error) {
		console.error("Image upload error:", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function fetchUserFriends(req, res) {
	const userId = req.user.userId;

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
