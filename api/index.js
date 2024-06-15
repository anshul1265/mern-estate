import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config("");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to the database.") })
  .catch(() => { console.log("Error while connecting to the database.") });

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running at Port 3000.`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
})