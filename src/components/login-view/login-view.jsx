import { useState } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      Username: username,
      Password: password,
    };

    fetch("https://movie-api-tvzg.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        return data;
      })
      .then((data) => {
        if (data.user && data.token) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token);
        } else {
          throw new Error("Login response missing user/token");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="loginUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={5}
          placeholder="Enter your username"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Submit
      </Button>
    </Form>
  );
};
