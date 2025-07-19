import { cloudinary } from "../utils/cloudinary.util.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import FriendRequest from "../models/friendRequest.model.js";

export async function createPost(req, res) {
	try {
		const { text } = req.body;
		const userId = req.user.userId;

		if (!text && !req.file)
			return res
				.status(400)
				.json({ error: "Post must include text or an image." });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found." });
		const post = new Post({
			text: text || "",
			user: userId,
			image: req.file?.path || "",
		});
		await post.save();
		return res.status(201).json({ post, message: "Post created successfully" });
	} catch (error) {
		console.error("Error in create Post", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function getAllPosts(req, res) {
	try {
		const currentUserId = req.user.userId;
		const currentUser = await User.findById(currentUserId);

		const posts = await Post.find()
			.populate("user", "firstName lastName email profileImage")
			.sort({ createdAt: -1 });

		const updatedPosts = await Promise.all(
			posts.map(async (post) => {
				let requestStatus = "none";
				let requestId = null;

				if (currentUser.friends.includes(post.user._id)) {
					requestStatus = "accepted";
				} else {
					const existing = await FriendRequest.findOne({
						$or: [
							{ sender: currentUserId, receiver: post.user._id },
							{ sender: post.user._id, receiver: currentUserId },
						],
					});
					if (existing) {
						requestStatus =
							existing.sender.toString() === currentUserId
								? existing.status // "pending"
								: "incoming"; // you received the request
						requestId = existing._id;
					}
				}

				return {
					...post.toObject(),
					requestStatus,
					requestId,
				};
			})
		);

		return res.status(200).json({ posts: updatedPosts });
	} catch (error) {
		console.error("Error in fetching all Posts", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function deletePost(req, res) {
	const userId = req.user.userId;
	const { id: postId } = req.params;

	try {
		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ error: "Post not found." });

		// check if my post;
		if (userId !== post.user.toString())
			return res
				.status(403)
				.json({ error: "You can only delete your own post." });

		// Delete image from Cloudinary first;
		if (post.image) {
			const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
			await cloudinary.uploader.destroy(`flocksy/posts/${publicId}`);
		}

		// Delete all related comments;
		await Comment.deleteMany({ post: post._id });

		// finally delete the post;
		await post.deleteOne();

		res.status(200).json({ message: "Post was deleted successfully" });
	} catch (error) {
		console.error("Error in delete Post :", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function getASinglePost(req, res) {
	const { postId } = req.params;
	try {
		// fetch post from db;
		const post = await Post.findById(postId).populate(
			"user",
			"firstName lastName profileImage"
		);
		if (!post) return res.status(404).json({ error: "Post not found" });
		// check if post contains comments;
		const comments = await Comment.find({ post: postId })
			.populate("user", "firstName lastName profileImage")
			.sort({ createdAt: -1 }); // latest comment at the top;
		// return both the post and comments;
		return res.status(200).json({ post, comments });
	} catch (error) {
		console.error("Error in get a single post", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function getUserPosts(req, res) {
	const { userId } = req.params;
	try {
		const posts = await Post.find({ user: userId })
			.populate("user", "firstName lastName profileImage")
			.sort({ createdAt: -1 });

		return res.status(200).json({ posts });
	} catch (error) {
		console.error("Error in get user posts", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function likeUnlikePost(req, res) {
	const { id: postId } = req.params;
	const userId = req.user.userId;
	try {
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found." });

		// check if user has already liked the post;
		const hasLikedPost = post.likes.includes(userId);
		// if true then unlike the post;
		if (hasLikedPost) {
			post.likes = post.likes.filter((user) => user.toString() !== userId);
		} else {
			// otherwise like the post;
			post.likes.push(userId);
		}
		await post.save();

		return res.status(200).json({ message: "success", post });
	} catch (error) {
		console.error("Error in likeUnlikePost", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}