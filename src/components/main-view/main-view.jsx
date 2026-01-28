import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const API_BASE_URL = "https://movie-api-tvzg.onrender.com";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    setIsLoading(true);
    setFetchError("");

    fetch(`${API_BASE_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
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
    setFetchError("");
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={onLoggedOut} />

      <Container className="py-4">
        {fetchError && (
          <Alert variant="danger" className="mb-3">
            <b>Error:</b> {fetchError}
          </Alert>
        )}

        <Row className="justify-content-md-center">
          <Routes>
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={6} lg={5}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="mb-3">Sign Up</Card.Title>
                        <SignupView apiBaseUrl={API_BASE_URL} />
                      </Card.Body>
                    </Card>
                  </Col>
                )
              }
            />

            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={6} lg={5}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="mb-3">Login</Card.Title>
                        <LoginView
                          apiBaseUrl={API_BASE_URL}
                          onLoggedIn={(newUser, newToken) => {
                            setUser(newUser);
                            setToken(newToken);
                          }}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                )
              }
            />

            <Route
              path="/movies/:movieId"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : isLoading ? (
                  <Col>Loading movies...</Col>
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={10} lg={8}>
                    <MovieView
                      movies={movies}
                      user={user}
                      token={token}
                      apiBaseUrl={API_BASE_URL}
                      onUserUpdated={(updatedUser) => {
                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                      }}
                    />
                  </Col>
                )
              }
            />

            <Route
              path="/profile"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col md={10} lg={8}>
                    <ProfileView
                      user={user}
                      token={token}
                      movies={movies}
                      apiBaseUrl={API_BASE_URL}
                      onUserUpdated={(updatedUser) => {
                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                      }}
                      onLoggedOut={onLoggedOut}
                    />
                  </Col>
                )
              }
            />

            <Route
              path="/"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : isLoading ? (
                  <Col>Loading movies...</Col>
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col>
                    <Row className="g-4">
                      {movies.map((movie) => (
                        <Col key={movie._id} sm={6} md={4} lg={3}>
                          <MovieCard
                            movie={movie}
                            user={user}
                            token={token}
                            apiBaseUrl={API_BASE_URL}
                            onUserUpdated={(updatedUser) => {
                              setUser(updatedUser);
                              localStorage.setItem(
                                "user",
                                JSON.stringify(updatedUser)
                              );
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                )
              }
            />
          </Routes>
        </Row>
      </Container>
    </BrowserRouter>
  );
};
