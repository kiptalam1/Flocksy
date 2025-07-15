import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: "Post",
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
