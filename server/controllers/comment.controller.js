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


export async function deleteComment(req, res) {
	const { id: commentId } = req.params;
	const userId = req.user.userId;
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) return res.status(404).json({ error: "Comment not found." });

		// check if post belongs to user;
		if (userId !== comment.user.toString()) {
			return res
				.status(403)
				.json({ error: "You can only delete your own comment." });
		}

		// finally delete the comment;
		await comment.deleteOne();
		return res.status(200).json({ message: "Comment deleted successfully." });
	} catch (error) {
		console.error("Error in delete comment", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function likeUnlikeComment(req, res) {
	const { id: commentId } = req.params;
	const userId = req.user.userId;
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) return res.status(404).json({ error: "Comment not found." });

		// check if user has already liked the comment;
		const hasLikedComment = comment.likes.includes(userId);
		// if true then unlike the comment;
		if (hasLikedComment) {
			comment.likes = comment.likes.filter(
				(user) => user.toString() !== userId
			);
		} else {
			// otherwise like the post;
			comment.likes.push(userId);
		}
		await comment.save();

		return res.status(200).json({ message: "success", comment });
	} catch (error) {
		console.error("Error in likeUnlikeComment", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}