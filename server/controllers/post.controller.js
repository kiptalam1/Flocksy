import { cloudinary } from "../utils/cloudinary.util.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

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
		const posts = await Post.find()
			.populate("user", "firstName lastName email")
			.sort({ createdAt: -1 });

		return res.status(200).json({ posts });
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

		// Delete image from Cloudinary
		if (post.image) {
			const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
			await cloudinary.uploader.destroy(`flocksy/posts/${publicId}`);
		}

		// Delete all related comments
		await Comment.deleteMany({ post: post._id });

		await post.deleteOne();
		res.status(200).json({ message: "Post was deleted successfully" });
	} catch (error) {
		console.error("Error in delete Post :", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
