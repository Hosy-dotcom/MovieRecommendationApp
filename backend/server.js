import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movie.route.js";
import authRoutes from "./routes/auth.route.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow localhost and any vercel.app domain
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin || 
      origin === "http://localhost:5173" || 
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
