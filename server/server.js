import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
dotenv.config();

import cookieParser from "cookie-parser";
// functions
import connectToDb from "./db/mongoDB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import friendRoutes from "./routes/friendRequest.route.js";

const app = express();

//middleware;
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//routes;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/friends", friendRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
	// serve static files from the frontend build directory
	app.use(express.static(path.join(__dirname, "/client/dist")));

	// handle any requests that don't match the above routes
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
	connectToDb();
});
