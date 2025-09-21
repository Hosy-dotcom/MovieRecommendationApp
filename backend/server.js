import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movie.route.js";
import authRoutes from "./routes/auth.route.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173", 
  "https://movie-recommendation-app.vercel.app", 
  "https://movie-recommendation-app-tan.vercel.app",
   "https://movie-recommendation-1e53qenxd-hnin-oo-shwe-yis-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
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
