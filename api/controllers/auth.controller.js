import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 4);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully."
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Invalid Credentials."));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Invalid Credentials."));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...userInfo } = validUser._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...userInfo } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(userInfo);
    } else {
      // generating a random 16 digit password for the user
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      // making the username unique and without any kind of spaces
      const username = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
      const newUser = new User({ username: username, email: req.body.email, password: hashedPassword, avatar: req.body.photo });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...userInfo } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(userInfo);
    }
  } catch (error) {
    next(error);
  }
}