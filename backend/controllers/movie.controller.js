import mongoose from "mongoose";
import Movie from "../movies/movie.model.js";

export const getMovieById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
  
    try {
      const movie = await Movie.find({ user: req.user.userId }); // ✅ Only movies for the logged-in user

      if (!movie) {
        return res.status(404).json({ success: false, message: "Movie not found" });
      }
      res.status(200).json({ success: true, data: movie });
    } catch (error) {
      console.error("Error fetching movie by ID:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

export const getMovies = async(req, res) => {
        try {
            const movies = await Movie.find();
            res.status(200).json({success: true, data: movies});
        } catch (error) {
            console.log("Error in fetching movies: ", error.message);
            res.status(500).json({success: false, message: "Server error"});
        }       
};

export const createMovie = async(req, res) => {
    try{
    console.log("RequestBody",req.body);
    const movieData = { ...req.body, user: req.user.userId }; //user will send this data
    if(!movieData.name || !movieData.starrings || !movieData.genre || !movieData.movie_or_series || !movieData.image) {
        return res.status(400).json({error: "Please fill all the fields"});
    }

    const newMovie = new Movie(movieData);
    try {
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("Error in creating movie: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}catch (error) {
    console.error("Error in creating movie: ", error); // Log full error
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateMovie = async(req, res) => {
    const {id} = req.params;
    const movie = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Movie not found"});
    }
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(id, movie, {new: true});
        res.status(200).json({success: true, data: updatedMovie});
    } catch (error) {
        console.error("Error in updating movie: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
};

export const deleteMovie = async(req, res) => {
    const {id} = req.params; 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Movie not found"});
    }
    try{
        await Movie.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Movie deleted successfully"});    
    }catch (error) {
        console.log("Error in deleting movie: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}