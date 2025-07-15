import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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
