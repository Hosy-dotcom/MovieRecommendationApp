import express from "express";
import { createMovie, deleteMovie, getMovies, getMovieById, updateMovie } from "../controllers/movie.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate)

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie)
router.put("/:id", updateMovie) //:id dynamic
router.delete("/:id", deleteMovie);

export default router;