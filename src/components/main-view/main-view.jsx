import { useState, useEffect, useCallback, useMemo } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { SearchImportView } from "../search-import-view/search-import-view";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

const API_BASE_URL = "https://movie-api-tvzg.onrender.com";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchMovies = useCallback(() => {
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

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    setMovies([]);
    setFetchError("");
    localStorage.clear();
  };

  // Pick a hero background from your own movie posters so it feels “cinematic”
  const heroBg = useMemo(() => {
    if (!movies?.length) return "";
    const withPoster = movies.filter((m) => m.ImagePath);
    const pick = (withPoster.length ? withPoster : movies)[0];
    return pick?.ImagePath || "";
  }, [movies]);

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={onLoggedOut} />

      {/* Use your custom layout wrapper instead of Bootstrap Container */}
      <div className="appShell">
        {fetchError && (
          <Alert variant="danger" className="mb-3">
            <b>Error:</b> {fetchError}
          </Alert>
        )}

        <Routes>
          {/* SIGNUP */}
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Row className="justify-content-center">
                  <Col md={6} lg={5}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="mb-3">Sign Up</Card.Title>
                        <SignupView apiBaseUrl={API_BASE_URL} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Row className="justify-content-center">
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
                </Row>
              )
            }
          />

          {/* MOVIE VIEW */}
          <Route
            path="/movies/:movieId"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : isLoading ? (
                <div>Loading movies...</div>
              ) : movies.length === 0 ? (
                <div>The list is empty!</div>
              ) : (
                <Row className="justify-content-center">
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
                </Row>
              )
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Row className="justify-content-center">
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
                </Row>
              )
            }
          />

          {/* SEARCH / IMPORT */}
          <Route
            path="/search"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Row>
                  <Col md={12}>
                    <SearchImportView
                      apiBaseUrl={API_BASE_URL}
                      token={token}
                      onImported={() => fetchMovies()}
                    />
                  </Col>
                </Row>
              )
            }
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : isLoading ? (
                <div>Loading movies...</div>
              ) : movies.length === 0 ? (
                <div>The list is empty!</div>
              ) : (
                <>
                  {/* Sleep-well style hero */}
                  <section className="sw-hero">
                    {/* optional background image */}
                    {heroBg && (
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${heroBg})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          opacity: 0.22,
                          filter: "saturate(1.1) contrast(1.05) blur(1px)",
                          transform: "scale(1.08)",
                        }}
                      />
                    )}

                    <div style={{ position: "relative" }}>
                      <div className="sw-kicker">
                        CURATED CINEMA • PERSONAL LIBRARY
                      </div>

                      <h1 className="sw-title">
                        MOVIES
                        <br />
                        YOU
                        <br />
                        LOVE
                      </h1>

                      <p className="sw-subtitle">
                        Browse your collection, save favorites, and import new
                        picks. Built with a dark glass aesthetic inspired by
                        high-end editorial sites.
                      </p>

                      <div className="d-flex gap-2 flex-wrap mt-3">
                        <Badge bg="dark" className="px-3 py-2">
                          {movies.length} titles
                        </Badge>
                        <Badge bg="dark" className="px-3 py-2">
                          Signed in as {user?.Username}
                        </Badge>
                      </div>

                      <div className="d-flex gap-2 flex-wrap mt-3">
                        <Button as={Link} to="/search" variant="primary">
                          Import movies
                        </Button>
                        <Button as={Link} to="/profile" variant="outline-light">
                          Profile
                        </Button>
                      </div>

                      <div className="sw-scrollCue">Scroll to explore</div>
                    </div>
                  </section>

                  {/* Section 01 */}
                  <section className="sw-section">
                    <div className="sw-section__num">01</div>
                    <div className="sw-section__grid">
                      <div>
                        <h2 className="sw-h2">Your library</h2>
                        <p className="sw-p">
                          A clean, cinematic grid with hover depth, glass
                          surfaces, and typography-forward layout.
                        </p>
                      </div>

                      <div className="sw-panel" />
                    </div>
                  </section>

                  {/* Grid inside its own “section” */}
                  <section className="sw-section">
                    <div className="sw-section__num">02</div>
                    <div className="sw-section__grid">
                      <div>
                        <h2 className="sw-h2">Browse</h2>
                        <p className="sw-p">
                          Click a tile to view details. Posters softly zoom on
                          hover, like the reference vibe.
                        </p>
                      </div>

                      <div>
                        <Row className="g-4">
                          {movies.map((movie) => (
                            <Col key={movie._id} xs={6} md={4} lg={3}>
                              <MovieCard movie={movie} />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  </section>
                </>
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
