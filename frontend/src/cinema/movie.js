import { create } from 'zustand';

const API = import.meta.env.VITE_API_URL;

export const useMovieStore = create((set) => ({
    movies: [],
    setMovies: (movies) => set({ movies }),
  
    createMovie: async (newMovie) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token provided");
      return { success: false, message: "Unauthorized - No token provided" };
    }

    const res = await fetch(`${API}/api/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
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
  