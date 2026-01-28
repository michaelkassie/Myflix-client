import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const DEFAULT_API_BASE_URL = "";

export const ProfileView = ({
  user,
  token,
  movies = [],
  onUserUpdated,
  onLoggedOut,
  apiBaseUrl = DEFAULT_API_BASE_URL
}) => {
  const username =
    typeof user === "string" ? user : user?.Username || user?.username || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [formUsername, setFormUsername] = useState(username);
  const [formPassword, setFormPassword] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formBirthday, setFormBirthday] = useState("");

  const authedFetch = async (url, options = {}) => {
    if (!token) throw new Error("Missing token");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    return res;
  };

  const fetchUser = async () => {
    const res = await authedFetch(`${apiBaseUrl}/users`);
    const users = await res.json();
    const found = users.find((u) => u.Username === username || u.username === username);
    if (!found) throw new Error("User not found");

    setCurrentUser(found);
    setFormUsername(found.Username || "");
    setFormEmail(found.Email || "");
    setFormBirthday(found.Birthday ? found.Birthday.slice(0, 10) : "");
  };

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setLoading(true);
        if (!username) throw new Error("Missing username");
        await fetchUser();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && apiBaseUrl) run();
  }, [username, apiBaseUrl, token]);

  const favoriteMovies = useMemo(() => {
    if (!currentUser?.FavoriteMovies) return [];
    return movies.filter((m) => currentUser.FavoriteMovies.includes(m._id));
  }, [movies, currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const activeUsername = currentUser?.Username || username;

      const body = {
        Username: formUsername,
        Email: formEmail,
        Birthday: formBirthday
      };
      if (formPassword) body.Password = formPassword;

      const res = await authedFetch(
        `${apiBaseUrl}/users/${encodeURIComponent(activeUsername)}`,
        {
          method: "PUT",
          body: JSON.stringify(body)
        }
      );

      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
      onUserUpdated?.(updatedUser);
      setSuccess("Profile updated successfully");
      setFormPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeregister = async () => {
    if (!window.confirm("Are you sure you want to deregister?")) return;

    setError("");
    try {
      const activeUsername = currentUser?.Username || username;
      await authedFetch(`${apiBaseUrl}/users/${encodeURIComponent(activeUsername)}`, {
        method: "DELETE"
      });
      onLoggedOut?.();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async (movieId) => {
    setError("");
    try {
      const activeUsername = currentUser?.Username || username;

      await authedFetch(
        `${apiBaseUrl}/users/${encodeURIComponent(activeUsername)}/movies/${encodeURIComponent(
          movieId
        )}`,
        { method: "DELETE" }
      );

      await fetchUser();
      onUserUpdated?.({
        ...currentUser,
        FavoriteMovies: (currentUser?.FavoriteMovies || []).filter((id) => id !== movieId)
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!currentUser) {
    return <Alert variant="danger">Unable to load profile</Alert>;
  }

  return (
    <Row>
      <Col md={6}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Profile</Card.Title>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={formBirthday}
                  onChange={(e) => setFormBirthday(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" className="me-2">
                Update
              </Button>
              <Button variant="danger" onClick={handleDeregister}>
                Deregister
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>Favorite Movies</Card.Title>

            {favoriteMovies.length === 0 && <div>No favorite movies yet.</div>}

            {favoriteMovies.map((movie) => (
              <Card key={movie._id} className="mb-2">
                <Card.Body>
                  <Card.Title>{movie.Title}</Card.Title>
                  <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
                    <Button size="sm" variant="link" className="p-0 me-2">
                      Open
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeFavorite(movie._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
