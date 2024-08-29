import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY =
  "b1a7e9c413d1f9d4aee99cde0b7e4b7a6c3f1f2a8f3d8e7b2a1c6d4e8f9b3c5";
const REG_EXP_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  } else {
    console.log("Connected to the database!");
  }
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

db.query(createUsersTable, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created or already exists.");
  }
});

const addUser = (email, password, callback) => {
  db.query(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, password],
    (err, results) => {
      callback(err, results ? results.insertId : null);
    }
  );
};

const findUserByEmail = (email, callback) => {
  db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    callback(err, results ? results[0] : null);
  });
};

const updateUser = (email, newEmail, newPassword, callback) => {
  db.query(
    `UPDATE users SET email = ?, password = ? WHERE email = ?`,
    [newEmail, newPassword, email],
    (err, results) => {
      callback(err, results ? results.affectedRows : 0);
    }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required." });
  }

  if (!REG_EXP_PASSWORD.test(password)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid password format." });
  }

  addUser(email, password, (err, userId) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "User already exists or database error.",
      });
    }

    res.json({
      status: "success",
      message: "User registered successfully.",
      user: { email },
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required." });
  }

  findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials." });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ status: "success", message: "Login successful.", token });
  });
});

app.get("/getUser", authenticateToken, (req, res) => {
  db.query(
    "SELECT email, password FROM users WHERE email = ?",
    [req.user.email],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      res.json({ status: "success", user: results[0] });
    }
  );
});

app.put("/updateUser", authenticateToken, (req, res) => {
  const { email, password, newEmail, newPassword } = req.body;

  if (!email || !password || !newEmail || !newPassword) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required." });
  }

  findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials." });
    }

    updateUser(email, newEmail, newPassword, (err, changes) => {
      if (err || changes === 0) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to update user." });
      }

      res.json({
        status: "success",
        message: "User updated successfully.",
        user: { email: newEmail },
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
