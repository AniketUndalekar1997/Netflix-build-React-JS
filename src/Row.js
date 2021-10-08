import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
// ysff - eqzk - lska - cpdw - nohn;

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, isLargeRow = false, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    const name = movie?.name;
    const title = movie?.title;

    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(name || title || "")
        .then((url) => {
          // https://www.youtube.com/watch?v=1oAlHx5c86g
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <img
                onClick={() => handleClick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                key={movie.id}
                src={`${base_url}${
                  isLargeRow ? movie?.poster_path : movie?.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
