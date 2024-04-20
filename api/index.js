import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config("")

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to the database.") })
  .catch(() => { console.log("Error while connecting to the database.") });

const app = express();

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running at Port 3000.`);
});