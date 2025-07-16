import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			default: "",
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Post", postSchema);
