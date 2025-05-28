import React, { useState, useEffect } from "react";
import "../styles/TrackingPage.css";
import { useNavigate } from "react-router-dom";
import { VscArrowLeft } from "react-icons/vsc";

const TrackingPage = () => {
  const navigate = useNavigate();

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeasons, setSelectedSeasons] = useState({});
  const [pendingUpdates, setPendingUpdates] = useState({});

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    const token = localStorage.getItem("token"); // ✅ Retrieve token
  
    if (!token) {
      alert("Unauthorized: Please log in first!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/movies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Ensure token is sent
        },
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Unauthorized or server error");
      }
  
      if (data.success) {
        const seriesData = data.data.filter((item) => item.movie_or_series === "Series");
        const defaultSeasons = {};
        seriesData.forEach((s) => {
          defaultSeasons[s._id] = 1;
        });
        setSelectedSeasons(defaultSeasons);
        setSeries(seriesData);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (seriesId, seasonNumber) => {
    setSelectedSeasons((prev) => ({ ...prev, [seriesId]: parseInt(seasonNumber) }));
  };

  const toggleWatched = (seriesId, seasonIndex, episodeIndex) => {
    const updatedSeries = [...series];
    const seriesIndex = updatedSeries.findIndex((s) => s._id === seriesId);
    if (seriesIndex === -1) return;

    const seasons = updatedSeries[seriesIndex].seasons;
    const episodes = seasons[seasonIndex].episodes;

    const clickedEpisode = episodes[episodeIndex];

    if (clickedEpisode.watched) {
      // Unwatch clicked and all after
      for (let i = episodeIndex; i < episodes.length; i++) {
        episodes[i].watched = false;
      }
    } else {
      // Watch clicked and all before
      for (let i = 0; i <= episodeIndex; i++) {
        episodes[i].watched = true;
      }
    }

    setSeries(updatedSeries);

    setPendingUpdates((prev) => ({
      ...prev,
      [seriesId]: seasons,
    }));
  };

  const submitUpdates = async (seriesId) => {
    const token = localStorage.getItem("token"); // ✅ Retrieve token
  
    if (!token) {
      alert("Unauthorized: Please log in first!");
      return;
    }
  
    if (!pendingUpdates[seriesId]) return;
  
    try {
      await fetch(`http://localhost:5000/api/movies/${seriesId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Ensure token is sent
        },
        body: JSON.stringify({ seasons: pendingUpdates[seriesId] }),
      });
  
      const newPendingUpdates = { ...pendingUpdates };
      delete newPendingUpdates[seriesId];
      setPendingUpdates(newPendingUpdates);
  
      alert("Episodes updated successfully!");
    } catch (error) {
      console.error("Error updating episode status:", error);
    }
  };

  if (loading) return <p>Loading series...</p>;

  return (
  <div className="tracking-page">
    {/* Back Button */}
    <div className="back-button" onClick={() => navigate("/home")}>
      <VscArrowLeft size={30} />
    </div>

    {/* Series list wrapper */}
    <div className="series-list">
      {series.length === 0 ? (
        <p className="empty-message">No series found. Start adding your favorites to track progress!</p>
      ) : (
        series.map((show) => {
          const hasMultipleSeasons = show.seasons.length > 1;
          const selectedSeason = selectedSeasons[show._id] || 1;
          const selectedSeasonIndex = selectedSeason - 1;

          return (
            <div key={show._id} className="series-card">
              <img src={show.image} alt={show.name} className="series-image" />
              <div className="series-details">
                <h2>{show.name}</h2>
                <p className="genre">{show.genre.join(", ")}</p>

                {hasMultipleSeasons ? (
                  <select
                    value={selectedSeason}
                    onChange={(e) => handleSeasonChange(show._id, e.target.value)}
                  >
                    {show.seasons.map((season, idx) => (
                      <option key={idx} value={season.season_number}>
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>Season 1</p>
                )}

                <div className="episodes">
                  {show.seasons[selectedSeasonIndex].episodes.map((ep, idx) => (
                    <div
                      key={idx}
                      className={`episode-box ${ep.watched ? "watched" : ""}`}
                      onClick={() => toggleWatched(show._id, selectedSeasonIndex, idx)}
                    >
                      {ep.episode_number}
                    </div>
                  ))}
                </div>

                <button
                  className="submit-button"
                  onClick={() => submitUpdates(show._id)}
                  disabled={!pendingUpdates[show._id]}
                >
                  Submit
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

};

export default TrackingPage;
