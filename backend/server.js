import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movie.route.js";
import authRoutes from "./routes/auth.route.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
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
