import { create } from 'zustand';
export const useMovieStore = create((set) => ({
    movies: [],
    setMovies: (movies) => set({ movies }),
  
    createMovie: async (newMovie) => {
      try {

        
        // Validate newMovie fields before sending request
        // if (!newMovie.name || !newMovie.starring.length || !newMovie.genre.length || !newMovie.movie_or_series || !newMovie.image) {
        //   console.error("Validation Error:", newMovie);
        //   return { success: false, message: "Please fill all the fields correctly" };
        // }
        // // If it's a series, ensure episodes is provided
        // if (newMovie.movie_or_series === "series" && (!episodes || episodes < 1)) {
        //   return res.status(400).json({ error: "Please specify number of episodes" });
        // }
        
    

        // Send API request
        const res = await fetch("http://localhost:5000/api/movies", {  // Change port if needed
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMovie),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          console.error("Server Error:", data);
          return { success: false, message: data.message || "Failed to create movie" };
        }
  
        set((state) => ({
          movies: [...state.movies, data.data]
        }));
        return { success: true, message: "Movie created successfully" };
        
      } catch (error) {
        console.error("Request Failed:", error);
        return { success: false, message: "Network error or backend not running" };
      }
    },
  }));
  