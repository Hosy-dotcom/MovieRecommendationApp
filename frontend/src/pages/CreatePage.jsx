import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePage.css";
import { VscArrowLeft } from "react-icons/vsc";

const CreatePage = () => {
  const [newMovie, setNewMovie] = useState({
    name: "",
    starring: [],
    genre: [],
    isSeries: false,
    image: "",
    numberOfSeasons: 1,
    episodesPerSeason: [],
  });

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [starringInput, setStarringInput] = useState("");
  const navigate = useNavigate();

  // ✅ Function to send authenticated movie creation request
  const createMovie = async (movieData) => {
    const token = localStorage.getItem("token"); // 🔴 Retrieve JWT token

    if (!token) {
      alert("Unauthorized: Please log in first!");
      return { success: false };
    }


    try {
      const response = await fetch("http://localhost:5000/api/movies/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Sending token in header
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating movie:", error);
      return { success: false, message: "Server error" };
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = newMovie.image.trim() !== "" ? newMovie.image.trim() : "../../assets/placeholder.jpg";
    const seasons = newMovie.isSeries
      ? newMovie.episodesPerSeason.map((count, index) => ({
          season_number: index + 1,
          episodes: Array.from({ length: count }, (_, i) => ({
            episode_number: i + 1,
            watched: false,
          })),
        }))
      : [];

    const movieData = {
      name: newMovie.name.trim(),
      starrings: newMovie.starring.map((s) => s.trim()),
      genre: newMovie.genre,
      movie_or_series: newMovie.isSeries ? "Series" : "Movie",
      image: imageUrl,
      seasons,
    };

    const response = await createMovie(movieData); // ✅ Call authentication-aware function

    if (!response.success) {
      alert(response.message);
      return;
    }

    setNewMovie({
      name: "",
      starring: [],
      genre: [],
      isSeries: false,
      image: "",
      numberOfSeasons: 1,
      episodesPerSeason: [],
    });
    setSelectedGenres([]);
    setStarringInput("");
  };

  return (
    <div className="container">
      <div className="back-button" onClick={() => navigate("/")}>
        <VscArrowLeft size={30} />
      </div>
      <div className="contents">
        <h1>Add new movies to your movie list ^_^</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newMovie.name}
              onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>

          {/* Starring */}
          <div className="form-group">
            <label>Starring:</label>
            <div className="starring-input">
              <input
                value={starringInput}
                onChange={(e) => setStarringInput(e.target.value)}
                placeholder="Enter actor's name"
              />
              <button type="button" onClick={() => {
                if (starringInput && !newMovie.starring.includes(starringInput)) {
                  setNewMovie({ ...newMovie, starring: [...newMovie.starring, starringInput] });
                  setStarringInput("");
                }
              }}>
                +
              </button>
            </div>
            <ul>
              {newMovie.starring.map((s, i) => (
                <li key={i}>
                  {s} <button type="button" onClick={() => setNewMovie({ ...newMovie, starring: newMovie.starring.filter((_, idx) => idx !== i) })}>x</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre */}
          <div className="form-group">
            <label>Genre:</label>
            <Select isMulti value={selectedGenres} options={[
              { value: "action", label: "Action" },
              { value: "comedy", label: "Comedy" },
              { value: "drama", label: "Drama" },
              { value: "horror", label: "Horror" },
              { value: "romance", label: "Romance" },
              { value: "thriller", label: "Thriller" },
              { value: "sci-fi", label: "Sci-Fi" },
              { value: "fantasy", label: "Fantasy" },
              { value: "animation", label: "Animation" },
              { value: "documentary", label: "Documentary" },
              { value: "crime", label: "Crime" },
              { value: "sliceoflife", label: "Slice of Life" },
            ]}
            onChange={(selectedOptions) => {
              setSelectedGenres(selectedOptions);
              setNewMovie({ ...newMovie, genre: selectedOptions.map((g) => g.value) });
            }} />
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Type:</label>
            <div>
              <label>
                <input type="radio" checked={!newMovie.isSeries} onChange={() => setNewMovie({ ...newMovie, isSeries: false })} />
                Movie
              </label>
              <label>
                <input type="radio" checked={newMovie.isSeries} onChange={() => setNewMovie({ ...newMovie, isSeries: true, numberOfSeasons: 1, episodesPerSeason: [1] })} />
                Series
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newMovie.image}
              onChange={(e) => setNewMovie({ ...newMovie, image: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;