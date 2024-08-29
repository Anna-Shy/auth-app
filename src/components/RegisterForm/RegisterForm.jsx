import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./registerForm.scss";

// eslint-disable-next-line no-useless-escape
const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
const REG_EXP_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

export const RegisterForm = () => {
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

    if (!REG_EXP_PASSWORD.test(password)) {
      setError(
        "Password must be 6-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      if (res.data.status === "success") {
        navigate("/");
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

      <form onSubmit={handleSubmit} className="RegisterForm__form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="RegisterForm__form-input"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="RegisterForm__form-input"
          required
        />

        <button type="submit" className="RegisterForm__form-btn">
          Register
        </button>
      </form>
    </>
  );
};
