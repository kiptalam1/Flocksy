import express from "express";
import dotenv from "dotenv";
import connectToDb from "./db/mongoDB.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
	connectToDb();
});
