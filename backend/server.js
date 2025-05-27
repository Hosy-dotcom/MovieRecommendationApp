import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movie.route.js";
import authRoutes from "./routes/auth.route.js"; // ✅ Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 Enable CORS (Allow frontend requests)
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json()); // Enable JSON parsing

// ✅ Mount routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes); // ✅ Add this line

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
