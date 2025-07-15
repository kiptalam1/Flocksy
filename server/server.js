import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
// functions
import connectToDb from "./db/mongoDB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

//middleware;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
	connectToDb();
});
