const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../models/db");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    const query = `INSERT INTO user (email, password, username, token) VALUES (?, ?, ?, ?)`;
    connection.query(query, [email, hashedPassword, nickname, token], error => {
      if (error) {
        console.error("Error inserting user:", error);
        return res.status(500).send("Server error");
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking on the following link: http://localhost:3001/verify?token=${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send verification email:", error);
          return res.status(500).send("Failed to send verification email");
        }
        res
          .status(201)
          .send(
            "User registered. Please check your email for verification link."
          );
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Server error");
  }
};

exports.verifyEmail = (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const query = `UPDATE user SET is_verified = 1 WHERE email = ?`;
    connection.query(query, [decoded.email], (error, results) => {
      if (error) {
        console.error("Error verifying email:", error);
        return res.status(500).send("Server error");
      }
      res.status(200).send("Email verified successfully");
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).send("Invalid token");
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
        expiresIn: "2h",
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

exports.kakaoLogin = async (req, res) => {
  const { code } = req.body;

  try {
    const kakaoTokenResponse = await axios.post(
      `https://kauth.kakao.com/oauth/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = kakaoTokenResponse.data;

    const kakaoUserResponse = await axios.get(
      `https://kapi.kakao.com/v2/user/me`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { kakao_account } = kakaoUserResponse.data;
    const email = kakao_account.email;
    let nickname = kakao_account.profile.nickname;

    if (!email) {
      return res.status(400).send("Email not provided by Kakao");
    }

    const checkNickname = async nickname => {
      const query = `SELECT COUNT(*) as count FROM user WHERE username = ?`;
      return new Promise((resolve, reject) => {
        connection.query(query, [nickname], (error, results) => {
          if (error) return reject(error);
          resolve(results[0].count);
        });
      });
    };

    let count = await checkNickname(nickname);
    let baseNickname = nickname;
    let suffix = 1;

    while (count > 0) {
      nickname = `${baseNickname}${suffix}`;
      count = await checkNickname(nickname);
      suffix++;
    }

    const query = `SELECT * FROM user WHERE email = ?`;
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        const hashedPassword = await bcrypt.hash("kakao_default_password", 10);
        const insertQuery = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;
        connection.query(
          insertQuery,
          [email, nickname, hashedPassword],
          (error, results) => {
            if (error) {
              console.error("Error inserting user:", error);
              return res.status(500).send("Server error");
            }
            const userId = results.insertId;
            res.status(200).json({ userId, nickname, isNewUser: true });
          }
        );
      } else {
        const user = results[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "2h",
        });
        res.status(200).json({
          token,
          userId: user.id,
          nickname: user.username,
          isNewUser: false,
        });
      }
    });
  } catch (error) {
    console.error(
      "Kakao login error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Kakao login error");
  }
};
