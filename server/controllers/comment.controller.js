import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export async function createComment(req, res) {
	const { id: postId } = req.params;
	const userId = req.user.userId;
	try {
		// check if comment is provided;
		const { text } = req.body;
		if (!text)
			return res.status(400).json({ error: "Comment cannot be empty" });

		// check if post being commented on is available;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found." });

		// now save comment to db;
		const comment = new Comment({
			text,
			user: userId,
			post: postId,
		});
		await comment.save();

		return res.status(201).json({ comment, message: "Comment created." });
	} catch (error) {
		console.error("Error in create comment", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
