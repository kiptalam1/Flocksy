import mongoose from "mongoose";

export default async function connectToDb() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
}
