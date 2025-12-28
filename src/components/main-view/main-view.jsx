import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies] = useState([
    {
      _id: "1",
      Title: "Inception",
      Description:
        "A thief who steals corporate secrets through dream-sharing technology is given an inverse task.",
      ImagePath: "https://m.media-amazon.com/images/I/51s+u0FfJTL._AC_.jpg",
      Genre: {
        Name: "Sci-Fi",
        Description: "Stories driven by futuristic science and technology."
      },
      Director: {
        Name: "Christopher Nolan",
        Bio: "Known for mind-bending narratives and big cinematic set pieces.",
        Birth: "1970"
      }
    },
    {
      _id: "2",
      Title: "The Dark Knight",
      Description:
        "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
      ImagePath: "https://m.media-amazon.com/images/I/51EbJjlLgWL._AC_.jpg",
      Genre: {
        Name: "Action",
        Description: "High-stakes conflict with intense sequences and momentum."
      },
      Director: {
        Name: "Christopher Nolan",
        Bio: "Director of the Dark Knight trilogy and other modern classics.",
        Birth: "1970"
      }
    },
    {
      _id: "3",
      Title: "Parasite",
      Description:
        "A poor family schemes to become employed by a wealthy household, leading to unexpected consequences.",
      ImagePath:
        "https://m.media-amazon.com/images/I/91i2qU+WZPL._AC_SL1500_.jpg",
      Genre: {
        Name: "Thriller",
        Description: "Tension-driven stories full of suspense and surprise."
      },
      Director: {
        Name: "Bong Joon-ho",
        Bio: "Acclaimed filmmaker known for sharp social commentary.",
        Birth: "1969"
      }
    }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

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
