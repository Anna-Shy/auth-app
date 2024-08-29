import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./loginForm.scss";

// eslint-disable-next-line no-useless-escape
const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!REG_EXP_EMAIL.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.data.status === "success") {
        localStorage.setItem("authToken", res.data.token);
        navigate("/admin");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="LoginForm__form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="LoginForm__form-input"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="LoginForm__form-input"
          required
        />

        <button type="submit" className="LoginForm__form-btn">
          Login
        </button>
      </form>
    </>
  );
};
