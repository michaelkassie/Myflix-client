import { useState } from "react";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

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
        alert("Signup successful! You can now log in.");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
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
          minLength="8"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </div>

      <button className="primary-btn" type="submit">
        Submit
      </button>
    </form>
  );
};
