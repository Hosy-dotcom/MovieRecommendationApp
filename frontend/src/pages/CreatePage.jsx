import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePage.css";
import { useMovieStore } from "../cinema/movie";
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

  const { createMovie } = useMovieStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleCheckboxChange = () => {
    const toggledIsSeries = !newMovie.isSeries;
    setNewMovie({
      ...newMovie,
      isSeries: toggledIsSeries,
      numberOfSeasons: 1,
      episodesPerSeason: toggledIsSeries ? [1] : [],
    });
  };

  const handleStarringChange = () => {
    if (starringInput && !newMovie.starring.includes(starringInput)) {
      setNewMovie({ ...newMovie, starring: [...newMovie.starring, starringInput] });
      setStarringInput("");
    }
  };

  const handleRemoveStarring = (index) => {
    const updated = newMovie.starring.filter((_, i) => i !== index);
    setNewMovie({ ...newMovie, starring: updated });
  };

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
    setNewMovie({ ...newMovie, genre: selectedOptions.map((g) => g.value) });
  };

  const handleSeasonsChange = (e) => {
    const numSeasons = parseInt(e.target.value, 10);
    const newEpisodesPerSeason = Array(numSeasons).fill(1);
    setNewMovie({
      ...newMovie,
      numberOfSeasons: numSeasons,
      episodesPerSeason: newEpisodesPerSeason,
    });
  };

  const handleEpisodeCountChange = (index, value) => {
    const updated = [...newMovie.episodesPerSeason];
    updated[index] = parseInt(value, 10) || 0;
    setNewMovie({ ...newMovie, episodesPerSeason: updated });
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

    const response = await createMovie(movieData);

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

  const genreOptions = [
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
  ];

  return (
    <div className="container">
        {/* Back Button */}
        <div className="back-button" onClick={() => navigate("/")}>
          <VscArrowLeft size={30} />
        </div>
      <div className="contents">
        <h1>Add new movies to your movie list ^_^ </h1>

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newMovie.name}
              onChange={handleInputChange}
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
              <button type="button" onClick={handleStarringChange}>+</button>
            </div>
            <ul>
              {newMovie.starring.map((s, i) => (
                <li key={i}>
                  {s} <button type="button" onClick={() => handleRemoveStarring(i)}>x</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre */}
          <div className="form-group">
            <label>Genre:</label>
            <Select isMulti value={selectedGenres} options={genreOptions} onChange={handleGenreChange} />
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Type:</label>
            <div>
              <label>
                <input type="radio" checked={!newMovie.isSeries} onChange={handleCheckboxChange} />
                Movie
              </label>
              <label>
                <input type="radio" checked={newMovie.isSeries} onChange={handleCheckboxChange} />
                Series
              </label>
            </div>
          </div>

          {/* Series Controls */}
          {newMovie.isSeries && (
            <>
              <div className="form-group">
                <label>Number of Seasons:</label>
                <select value={newMovie.numberOfSeasons} onChange={handleSeasonsChange}>
                  {[...Array(20).keys()].map((i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              {newMovie.episodesPerSeason.map((val, i) => (
                <div key={i} className="form-group">
                  <label>Episodes in Season {i + 1}:</label>
                  <input
                    type="number"
                    min={1}
                    value={val}
                    onChange={(e) => handleEpisodeCountChange(i, e.target.value)}
                    placeholder="e.g., 8"
                    required
                  />
                </div>
              ))}
            </>
          )}

          {/* Image */}
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newMovie.image}
              onChange={handleInputChange}
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
