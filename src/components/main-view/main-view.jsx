import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

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
          setSelectedMovie(null);
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
                      onLoggedIn={(newUser, newToken) => {
                        setUser(newUser);
                        setToken(newToken);
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
    );
  }

  // ---------- MOVIE LIST ----------
  return (
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
  );
};
