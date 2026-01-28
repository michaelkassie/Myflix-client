import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export const SignupView = ({
  apiBaseUrl = "https://movie-api-tvzg.onrender.com",
}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const payload = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch(`${apiBaseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const msg =
            data?.message || data?.error || "Signup failed";
          throw new Error(msg);
        }

        return data;
      })
      .then(() => {
        setSuccess("Signup successful! Redirecting to login...");
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
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

      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="signupUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={5}
          placeholder="Enter a username"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          placeholder="Enter a password"
        />
        <Form.Text muted>Must be at least 8 characters.</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="name@example.com"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupBirthday">
        <Form.Label>Birthday</Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Submit
      </Button>
    </Form>
  );
};
