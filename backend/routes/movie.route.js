import express from "express";
import { createMovie, deleteMovie, getMovies, getMovieById, updateMovie } from "../controllers/movie.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", authenticate, getMovies);
router.get("/:id",authenticate, getMovieById);
router.post("/", authenticate, createMovie)
router.put("/:id",authenticate, updateMovie) 
router.delete("/:id",authenticate, deleteMovie);

export default router;