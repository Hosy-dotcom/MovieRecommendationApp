import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExplorePage.css";
import { VscArrowLeft } from "react-icons/vsc";

const moodOccasionGenreMap = {
  happy: {
    default: ["comedy", "animation", "family"],
    family: ["animation", "comedy", "family"],
    friends: ["comedy", "adventure"],
    solo: ["comedy", "slice of life"],
    date: ["romance", "comedy"],
  },
  sad: {
    default: ["drama", "slice of life"],
    solo: ["drama", "slice of life"],
    friends: ["comedy"],
    family: ["family", "drama"],
    date: ["romance", "drama"],
  },
  romantic: {
    default: ["romance", "drama"],
    date: ["romance"],
    solo: ["romance", "drama"],
  },
  lazy: {
    default: ["comedy", "slice of life", "animation"],
    solo: ["comedy", "slice of life"],
    friends: ["comedy", "animation"],
  },
  adventurous: {
    default: ["action", "adventure", "fantasy"],
    friends: ["adventure", "action", "fantasy"],
    solo: ["action", "adventure", "thriller"],
  },
};

const API = import.meta.env.VITE_API_URL;


const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("");
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [genre, setGenre] = useState("");
  const [actor, setActor] = useState("");
  const [step, setStep] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = localStorage.getItem("token"); // ✅ Retrieve token
  
    if (!token) {
      alert("Unauthorized: Please log in!");
      return;
    }
  
    try {
      const response = await fetch(`${API}/api/movies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Ensure token is sent
        },
      });
  
      if (!response.ok) {
        throw new Error("Unauthorized or server error");
      }
  
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
        setFilteredMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleMoodOccasionFilter = () => {
  const preferredGenres =
    moodOccasionGenreMap[mood]?.[occasion] ||
    moodOccasionGenreMap[mood]?.["default"] ||
    [];

  if (preferredGenres.length === 0) {
    setFilteredMovies([]);
    return;
  }

  const result = movies.filter((movie) =>
    movie.genre?.some((g) => preferredGenres.includes(g.toLowerCase()))
  );

  setFilteredMovies(result);
};


  const handleTraditionalFilter = () => {
    const result = movies.filter((movie) => {
      const genreMatch = genre ? movie.genre?.some((g) => g.toLowerCase() === genre.toLowerCase()) : true;
      const actorMatch = actor
        ? movie.starrings?.some((name) =>
            name.toLowerCase().includes(actor.toLowerCase())
          )
        : true;
      return genreMatch && actorMatch;
    });

    setFilteredMovies(result);
  };

  return (
    <div className="explore-page">
       {/* Back Button */}
            <div className="back-button" onClick={() => navigate("/home")}>
              <VscArrowLeft size={30} />
            </div>
      <div className="p-6 explore-container">
        <h1 className="explore-title">Explore Movies</h1>

        {/* Tab Buttons */}
        <div className="tab-buttons mb-6">
          <button
            className={`tab-btn ${activeTab === "mood" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("mood");
              setStep(1);
            }}
          >
            Mood-Based
          </button>
          <button
            className={`tab-btn ${activeTab === "traditional" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("traditional");
              setStep(1);
            }}
          >
            Traditional
          </button>
        </div>

        {/* Mood-Based Prompt */}
        {activeTab === "mood" && step > 0 && (
          <div className="prompt-box">
            {step === 1 && (
              <>
                <label>How are you feeling today?</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                  <option value="">-- Select Mood --</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="romantic">Romantic</option>
                  <option value="lazy">Lazy</option>
                  <option value="adventurous">Adventurous</option>
                </select>
                <button className="filter-btn" onClick={() => setStep(2)}>
                  Next
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <label>What's the occasion?</label>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                  <option value="">-- Select Occasion --</option>
                  <option value="date">Movie Date</option>
                  <option value="solo">Solo Chill</option>
                  <option value="family">Family Time</option>
                  <option value="friends">Friends Night</option>
                </select>
                <button
                  className="filter-btn"
                  onClick={() => {
                    handleMoodOccasionFilter();
                    setStep(0);
                  }}
                >
                  Show Recommendations
                </button>
              </>
            )}
          </div>
        )}

        {/* Traditional Prompt */}
        {activeTab === "traditional" && step > 0 && (
          <div className="prompt-box">
            <label>Choose Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">-- Any Genre --</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
              <option value="romance">Romance</option>
              <option value="horror">Horror</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="thriller">Thriller</option>
              <option value="adventure">Adventure</option>
              <option value="animation">Animation</option>
              <option value="family">Family</option>
              <option value="slice of life">Slice of Life</option>
            </select>

            <label style={{ marginTop: "1rem" }}>Or Search Actor</label>
            <input
              type="text"
              placeholder="e.g., Tom Hanks"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />

            <button
              className="filter-btn"
              onClick={() => {
                handleTraditionalFilter();
                setStep(0);
              }}
            >
              Filter Movies
            </button>
          </div>
        )}

        {/* Movie Grid */}
        <div className="movie-grid">
          {filteredMovies.length === 0 ? (
            <p className="empty-message">No matching movies found.</p>
          ) : (
            filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="movie-card"
                onClick={() => navigate(`/movies/${movie._id}`)}
              >
                <img src={movie.image} alt={movie.name} />
                <h3>{movie.name}</h3>
                <p>{movie.genre?.join(", ")} — {movie.movie_or_series}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
