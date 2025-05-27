import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({ 
  name: {
    type: String,
    required: true,
    trim: true
  },
  starrings: {
    type: [String],
    required: true,
    trim: true
  },
  genre: {
    type: [String],
    required: true
  },
  movie_or_series: {
    type: String,
    enum: ["Movie", "Series"],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  seasons: [{
    season_number: { type: Number, required: true },
    episodes: [{
      episode_number: { type: Number, required: true },
      watched: { type: Boolean, default: false }
    }]
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
