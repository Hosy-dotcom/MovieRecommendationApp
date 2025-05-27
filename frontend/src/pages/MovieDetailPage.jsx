import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/MovieDetailPage.css";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        const data = await response.json();
        console.log("Fetched movie data:", data);

        if (data.success) {
          setMovie(data.data);
        } else {
          console.warn("Movie not found");
        }
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <button onClick={() => navigate("/explore")} className="movie-back-button">
          ← Back to Explore
        </button>
        <div className="movie-content">
          <img
            src={movie.image}
            alt={movie.name}
            className="movie-image"
          />
          <div className="movie-info">
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

            {/* Show Seasons and Episodes if available */}
            {movie.movie_or_series === "Series" && movie.seasons && movie.seasons.length > 0 && (
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
