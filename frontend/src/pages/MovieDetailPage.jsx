import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../styles/MovieDetailPage.css";

const API = import.meta.env.VITE_API_URL;

const genreOptions = [
  { value: "Action", label: "Action" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Horror", label: "Horror" },
  { value: "Romance", label: "Romance" },
  { value: "Thriller", label: "Thriller" },
  { value: "Sci-fi", label: "Sci-Fi" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Animation", label: "Animation" },
  { value: "Documentary", label: "Documentary" },
  { value: "Crime", label: "Crime" },
  { value: "Sliceoflife", label: "Slice of Life" },
];

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [starringInput, setStarringInput] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Unauthorized: Please log in first!");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/api/movies/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized or movie not found.");
        }

        const data = await response.json();
        if (data.success) {
          setMovie(data.data);
          setFormData(data.data);

          const prefilledGenres = data.data.genre?.map(g => ({
            value: g,
            label: g.charAt(0).toUpperCase() + g.slice(1),
          }));
          setSelectedGenres(prefilledGenres || []);
        }
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditMode(true);

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData(movie);
    const prefilledGenres = movie.genre?.map(g => ({
      value: g,
      label: g.charAt(0).toUpperCase() + g.slice(1),
    }));
    setSelectedGenres(prefilledGenres || []);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        alert("Movie updated!");
        setMovie(result.data);
        setFormData(result.data);
        setEditMode(false);
      } else {
        alert(result.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Server error");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        alert("Movie deleted successfully.");
        navigate("/explore");
      } else {
        alert(result.message || "Failed to delete movie.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Server error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <button onClick={() => navigate("/explore")} className="movie-back-button">
          ← Back to Explore
        </button>

        <div className="movie-content">
          <div class="image-wrapper">
            <img src={movie.image} alt={movie.name} className="movie-image" />
          </div>
          <div className="movie-info">
            <div className="movie-actions">
              {!editMode && <button onClick={handleEdit} className="edit-button">Edit</button>}
              <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>

            {editMode ? (
              <>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="edit-input"
                />

                <input
                  name="image"
                  value={formData.image || ""}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="Image URL"
                />

                <div className="form-group">
                  <label>Genre:</label>
                  <Select
                    isMulti
                    value={selectedGenres}
                    onChange={(selected) => {
                      setSelectedGenres(selected);
                      setFormData((prev) => ({
                        ...prev,
                        genre: selected.map((g) => g.value),
                      }));
                    }}
                    options={genreOptions}
                  />
                </div>

                <div className="form-group">
                  <label>Starrings:</label>
                  <div className="starring-input">
                    <input
                      value={starringInput}
                      onChange={(e) => setStarringInput(e.target.value)}
                      placeholder="Enter actor's name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          starringInput.trim() &&
                          !formData.starrings?.includes(starringInput.trim())
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            starrings: [...(prev.starrings || []), starringInput.trim()],
                          }));
                          setStarringInput("");
                        }
                      }}
                    >
                      +
                    </button>
                  </div>

                  <ul>
                    {formData.starrings?.map((s, i) => (
                      <li key={i}>
                        {s}{" "}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.starrings.filter((_, idx) => idx !== i);
                            setFormData((prev) => ({ ...prev, starrings: updated }));
                          }}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="form-actions">
                  <button onClick={handleUpdate} className="save-button">Save</button>
                  <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h1 className="movie-title">{movie.name}</h1>
                <p className="movie-detail-text">
                  <strong>Genres:</strong> {movie.genre?.join(", ")}
                </p>
                <p className="movie-detail-text">
                  <strong>Type:</strong> {movie.movie_or_series}
                </p>
                <p className="movie-detail-text">
                  <strong>Starrings:</strong> {movie.starrings?.join(", ")}
                </p>
              </>
            )}

            {movie.movie_or_series === "Series" && movie.seasons?.length > 0 && (
              <div className="seasons-section">
                <h2 className="seasons-title">Seasons and Episodes</h2>
                {movie.seasons.map((season, seasonIndex) => (
                  <div key={seasonIndex} className="season-block">
                    <h3 className="season-title">Season {season.season_number}</h3>
                    <ul className="episode-list">
                      {season.episodes.map((episode, episodeIndex) => (
                        <li key={episodeIndex} className={`episode-item ${episode.watched ? "watched" : ""}`}>
                          <span>Episode {episode.episode_number}</span>
                          {episode.watched && <span className="watched-label">✔ Watched</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
