import mongoose from "mongoose";
import Movie from "../movies/movie.model.js";

// ✅ Get a Movie by ID (only if owned by the user)
export const getMovieById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const movie = await Movie.findOne({ _id: id, user: req.user.userId }); // ✅ Only fetch user's movie

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    console.error("Error fetching movie by ID:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all movies belonging to the logged-in user
export const getMovies = async (req, res) => {
    try {
      console.log("User ID:", req.user?.userId); // ✅ Ensure user ID is available
      const movies = await Movie.find({ user: req.user.userId }); 
      res.status(200).json({ success: true, data: movies });
    } catch (error) {
      console.log("Error in fetching movies:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// Create a Movie (ensuring user ownership)
export const createMovie = async (req, res) => {
    try {
      console.log("Incoming request:", req.body);
      console.log("User ID:", req.user?.userId); // Check if user is attached
  
      const movieData = { ...req.body, user: req.user.userId };
  
      if (!movieData.name || !movieData.starrings || !movieData.genre || !movieData.movie_or_series || !movieData.image) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }
  
      const newMovie = new Movie(movieData);
      await newMovie.save();
      console.log("Movie saved successfully!");
      res.status(201).json({ success: true, message: "Movie created!", data: newMovie });
    } catch (error) {
      console.error("Movie creation failed:", error.message);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  

// Update a Movie (only if owned by the user)
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const movieData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Movie ID" });
  }

  try {
    const updatedMovie = await Movie.findOneAndUpdate({ _id: id, user: req.user.userId }, movieData, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ success: false, message: "Movie not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Movie updated successfully!", data: updatedMovie });
  } catch (error) {
    console.error("Error in updating movie:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a Movie (only if owned by the user)
export const deleteMovie = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Movie ID" });
  }

  try {
    const deletedMovie = await Movie.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!deletedMovie) {
      return res.status(404).json({ success: false, message: "Movie not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Movie deleted successfully!" });
  } catch (error) {
    console.error("Error in deleting movie:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};