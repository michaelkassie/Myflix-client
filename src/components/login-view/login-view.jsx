import { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

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
      .catch((err) => alert(err.message));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="5"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="primary-btn" type="submit">
        Submit
      </button>
    </form>
  );
};
