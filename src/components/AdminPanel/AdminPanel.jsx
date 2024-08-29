import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./adminPanel.scss";

export const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5000/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setUser(res.data.user);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        navigate("/");
        setError(err.response.data.message);
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        "http://localhost:5000/updateUser",
        {
          email: user.email,
          password: currentPassword,
          newEmail,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        // setUser({ ...user, email: newEmail });
        alert("Updated!");
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

      {user && (
        <div className="AdminPanel">
          <img
            src="https://picsum.photos/400/250"
            alt="avatar"
            className="AdminPanel-avatar"
          />

          <div className="AdminPanel__info">
            <p className="AdminPanel__info-text">Current Email: {user.email}</p>
            <p className="AdminPanel__info-text">
              Current Password: {user.password}
            </p>

            <div className="AdminPanel__info-form">
              <h4>Update email and password</h4>
              <input
                type="email"
                placeholder="New or current email "
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="AdminPanel__info-input"
                required
              />

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="AdminPanel__info-input"
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="AdminPanel__info-input"
              />

              <button onClick={handleUpdate} className="AdminPanel__info-btn">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
