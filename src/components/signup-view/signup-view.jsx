import { useState } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // Better UX than alert()
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch("https://movie-api-tvzg.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const text = await response.text();
        let result;

        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }

        if (!response.ok) {
          throw new Error(result.message || "Signup failed");
        }

        return result;
      })
      .then(() => {
        setSuccess("Signup successful! You can now log in.");
        // Optional: clear fields after success
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
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
