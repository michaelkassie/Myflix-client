import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";


export const MainView = () => {
  const [movies, setMovies] = useState([]);
;

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
  fetch("https://movie-api-tvzg.onrender.com/movies")
    .then((response) => response.json())
    .then((data) => {
      setMovies(data);
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}, []);


  // Show details view if a movie is selected
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  // Empty list fallback (good practice)
  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  // Otherwise show list of MovieCards
  return (
    <div>
      <h1>myFlix</h1>

      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
        />
      ))}
    </div>
  );
};
