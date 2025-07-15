import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
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
		comments: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Post", postSchema);
