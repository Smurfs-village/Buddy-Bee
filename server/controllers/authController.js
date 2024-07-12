const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../models/db");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO user (email, password, username) VALUES (?, ?, ?)`;
    connection.query(query, [email, hashedPassword, nickname], error => {
      if (error) {
        console.error("Error inserting user:", error);
        return res.status(500).send("Server error");
      }
      res.status(201).send("User registered");
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Server error");
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM user WHERE email = ?`;
  connection.query(query, [email], async (error, results) => {
    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send("Server error");
    }
    if (results.length === 0) {
      return res.status(401).send("Invalid email or password");
    }
    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).send("Invalid email or password");
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token, userId: user.id, nickname: user.username });
    } catch (error) {
      console.error("Error comparing password:", error);
      res.status(500).send("Server error");
    }
  });
};

exports.checkNickname = (req, res) => {
  const { nickname } = req.query;
  const query = `SELECT COUNT(*) as count FROM user WHERE username = ?`;
  connection.query(query, [nickname], (error, results) => {
    if (error) {
      console.error("Error checking nickname:", error);
      res.status(500).send("Server error");
      return;
    }
    const count = results[0].count;
    if (count > 0) {
      res.status(409).json({ isAvailable: false });
    } else {
      res.status(200).json({ isAvailable: true });
    }
  });
};

exports.getMe = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const query = `SELECT id, email, username FROM user WHERE id = ?`;
    connection.query(query, [decoded.userId], (error, results) => {
      if (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  const query = `SELECT password FROM user WHERE id = ?`;
  connection.query(query, [userId], async (error, results) => {
    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send("Server error");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }
    const user = results[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).send("Current password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE user SET password = ? WHERE id = ?`;
    connection.query(updateQuery, [hashedPassword, userId], error => {
      if (error) {
        console.error("Error updating password:", error);
        return res.status(500).send("Server error");
      }
      res.status(200).send("Password updated successfully");
    });
  });
};
