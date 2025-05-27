import User from "../movies/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}


export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Create user (password will be hashed in schema middleware)
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "Login successful", 
      token, //this is main
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
