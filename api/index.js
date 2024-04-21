import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
dotenv.config("");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to the database.") })
  .catch(() => { console.log("Error while connecting to the database.") });

const app = express();

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Working");
})

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running at Port 3000.`);
});