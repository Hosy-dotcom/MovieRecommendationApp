import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (process.env.NODE_ENV === "development") {
    console.log("Incoming Auth Header:", authHeader); // 🟡 Debug
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication Failed: No token provided");
    }
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (process.env.NODE_ENV === "development") {
      console.log("Decoded Token:", decoded); // 🟡 Debug
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Token Verification Failed:", error.message);
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};


export default authenticate;