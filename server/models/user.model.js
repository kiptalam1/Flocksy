import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		gender: {
			type: String,
			required: [true, "Gender is required"],
			enum: ["male", "female", "custom"],
		},
		profileImage: {
			type: String,
			default: "",
		},
		coverImage: {
			type: String,
			default: "",
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: 6,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
