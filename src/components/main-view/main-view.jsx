import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    setIsLoading(true);
    setFetchError("");

    fetch("https://movie-api-tvzg.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          // token invalid/expired → force logout so user can login again
          localStorage.clear();
          setUser(null);
          setToken(null);
          setMovies([]);
          throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => setFetchError(error.message))
      .finally(() => setIsLoading(false));
  }, [user, token]);

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    setMovies([]);
    setSelectedMovie(null);
    setFetchError("");
    localStorage.clear();
  };

  // ---------- AUTH SCREEN ----------
  if (!user) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
        <h1 style={{ marginBottom: "20px" }}>myFlix</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Login</h2>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
              }}
            />
          </section>

          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Sign Up</h2>
            <SignupView />
          </section>
        </div>
      </div>
    );
  }

  // ---------- MOVIE DETAILS ----------
  if (selectedMovie) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
        <button onClick={onLoggedOut} style={{ marginBottom: "12px" }}>
          Logout
        </button>
        <MovieView
          movie={selectedMovie}
          onBackClick={() => setSelectedMovie(null)}
        />
      </div>
    );
  }

  // ---------- MOVIE LIST ----------
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
      <h1>myFlix</h1>
      <button onClick={onLoggedOut} style={{ marginBottom: "16px" }}>
        Logout
      </button>

      {fetchError && (
        <div style={{ marginBottom: "12px" }}>
          <b>Error:</b> {fetchError}
        </div>
      )}

      {isLoading && <div>Loading movies...</div>}

      {!isLoading && movies.length === 0 && !fetchError && (
        <div>The list is empty!</div>
      )}

      {!isLoading &&
        movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
          />
        ))}
    </div>
  );
};
