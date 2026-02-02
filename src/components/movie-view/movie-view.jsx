import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useState, useMemo } from "react";

export const MovieView = ({ movies, user, token, apiBaseUrl, onUserUpdated }) => {
  const { movieId } = useParams();

  // If your route uses encodeURIComponent, decode it before matching.
  const decodedId = useMemo(() => {
    try {
      return decodeURIComponent(movieId);
    } catch {
      return movieId;
    }
  }, [movieId]);

  const movie = movies.find((m) => m._id === decodedId);

  const [error, setError] = useState("");

  if (!movie) return <div>Movie not found.</div>;

  const username = user?.Username || user?.username;
  const isFavorite = !!user?.FavoriteMovies?.includes(movie._id);

  const authedFetch = async (url, options = {}) => {
    if (!token) throw new Error("Missing token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    return res;
  };

  const addFavorite = async () => {
    setError("");
    if (!username) return;

    try {
      const res = await authedFetch(
        `${apiBaseUrl}/users/${encodeURIComponent(username)}/movies/${encodeURIComponent(
          movie._id
        )}`,
        { method: "POST" }
      );

      const updatedUser = await res.json();
      onUserUpdated?.(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async () => {
    setError("");
    if (!username) return;

    try {
      const res = await authedFetch(
        `${apiBaseUrl}/users/${encodeURIComponent(username)}/movies/${encodeURIComponent(
          movie._id
        )}`,
        { method: "DELETE" }
      );

      const updatedUser = await res.json();
      onUserUpdated?.(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="viewCard">
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Header row: back + title */}
        <div className="viewHeader mb-3">
          <Link to="/" className="text-decoration-none">
            <Button variant="link" className="p-0">
              ← Back
            </Button>
          </Link>

          <div className="actionRow">
            {isFavorite ? (
              <Button variant="outline-danger" onClick={removeFavorite}>
                Unfavorite
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={addFavorite}>
                Favorite
              </Button>
            )}
          </div>
        </div>

        <h1 className="viewTitle">{movie.Title}</h1>

        {/* Pills row */}
        <div className="movieMetaRow">
          {movie.Genre?.Name && <span className="pill">🎭 {movie.Genre.Name}</span>}
          {movie.Director?.Name && <span className="pill">🎬 {movie.Director.Name}</span>}
          {movie.Director?.Birth && <span className="pill">🗓️ {movie.Director.Birth}</span>}
        </div>

        {/* Main layout grid */}
        <div className="movieBodyGrid mt-3">
          <div className="posterWrap">
            {movie.ImagePath ? (
              <img
                className="posterImg"
                src={movie.ImagePath}
                alt={`${movie.Title} poster`}
                loading="lazy"
              />
            ) : (
              <div className="sw-panel d-flex align-items-center justify-content-center">
                No poster available
              </div>
            )}
          </div>

          <div>
            {movie.Description && <p className="movieDesc">{movie.Description}</p>}

            {/* Genre block */}
            {(movie.Genre?.Name || movie.Genre?.Description) && (
              <div className="mt-4">
                <h3 className="h5 mb-2">Genre</h3>
                <p className="mb-0">
                  <b>{movie.Genre?.Name}</b>
                  {movie.Genre?.Description ? `: ${movie.Genre.Description}` : ""}
                </p>
              </div>
            )}

            {/* Director block */}
            {(movie.Director?.Name || movie.Director?.Bio) && (
              <div className="mt-4">
                <h3 className="h5 mb-2">Director</h3>
                <p className="mb-1">
                  <b>{movie.Director?.Name}</b>
                  {movie.Director?.Birth ? ` (Born: ${movie.Director.Birth})` : ""}
                </p>
                {movie.Director?.Bio && <p className="mb-0">{movie.Director.Bio}</p>}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string,
      ImagePath: PropTypes.string,
      Genre: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string,
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Birth: PropTypes.string,
        Bio: PropTypes.string,
      }),
    })
  ).isRequired,
  user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  token: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  onUserUpdated: PropTypes.func,
};
