import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";


// React Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

// React Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

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
<<<<<<< Updated upstream
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}, []);
=======
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.clear();
          setUser(null);
          setToken(null);
          setMovies([]);
          throw new Error("Session expired. Please log in again.");
        }
>>>>>>> Stashed changes


<<<<<<< Updated upstream
  // Show details view if a movie is selected
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
=======
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
      <Container className="py-4">
        <Row className="justify-content-md-center">
          <Col md={10} lg={8}>
            <h1 className="mb-4">myFlix</h1>

            <Row className="g-4">
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Card.Title className="mb-3">Login</Card.Title>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Card.Title className="mb-3">Sign Up</Card.Title>
                    <SignupView />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  // ---------- MOVIE DETAILS ----------
  if (selectedMovie) {
    return (
      <Container className="py-4">
        <Row className="justify-content-md-center">
          <Col md={10} lg={8}>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="outline-secondary" onClick={onLoggedOut}>
                Logout
              </Button>
            </div>

            <MovieView
              movie={selectedMovie}
              onBackClick={() => setSelectedMovie(null)}
            />
          </Col>
        </Row>
      </Container>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    );
  }

  // Empty list fallback (good practice)
  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  // Otherwise show list of MovieCards
  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h1 className="mb-0">myFlix</h1>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={onLoggedOut}>
            Logout
          </Button>
        </Col>
      </Row>

      {fetchError && (
        <Alert variant="danger" className="mb-3">
          <b>Error:</b> {fetchError}
        </Alert>
      )}

      {isLoading && <div>Loading movies...</div>}

      {!isLoading && movies.length === 0 && !fetchError && (
        <div>The list is empty!</div>
      )}

      {!isLoading && movies.length > 0 && (
        <Row className="g-4">
          {movies.map((movie) => (
            <Col key={movie._id} sm={6} md={4} lg={3}>
              <MovieCard
                movie={movie}
                onMovieClick={(newSelectedMovie) =>
                  setSelectedMovie(newSelectedMovie)
                }
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  );
};
