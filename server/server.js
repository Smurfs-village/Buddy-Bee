const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const app = express();

// Load .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dbzlxoddl1",
  database: "buddy_bee",
  multipleStatements: true,
});

connection.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ filename: req.file.filename, url });
});

const extractFirstImage = content => {
  const imgTag = content.match(/<img[^>]+src="([^">]+)"/);
  return imgTag ? imgTag[1] : null;
};

// 프로젝트 생성 API
app.post("/api/projects", (req, res) => {
  const {
    title,
    content,
    type,
    targetAmount,
    startDate,
    endDate,
    createdBy,
    hashtags,
    maxParticipants,
    options,
    accountInfo,
  } = req.body;
  const mainImage = extractFirstImage(content);

  const createProjectQuery = `
    INSERT INTO project (title, description, type, target_amount, start_date, end_date, created_by, max_participants, options, main_image, account_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const projectValues = [
    title,
    content,
    type,
    targetAmount || null,
    startDate,
    endDate,
    createdBy,
    maxParticipants,
    JSON.stringify(options),
    mainImage,
    accountInfo,
  ];

  connection.query(createProjectQuery, projectValues, (error, results) => {
    if (error) {
      console.error("Error inserting project:", error);
      res.status(500).send("Server error");
      return;
    }

    const projectId = results.insertId;

    if (hashtags && hashtags.length > 0) {
      const hashtagQueries = hashtags
        .map(
          tag => `
        INSERT INTO hashtag (name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
      `
        )
        .join("; ");

      const hashtagValues = hashtags.flatMap(tag => [tag]);

      connection.query(hashtagQueries, hashtagValues, (error, results) => {
        if (error) {
          console.error("Error inserting hashtags:", error);
          res.status(500).send("Server error");
          return;
        }

        const hashtagIds = Array.isArray(results)
          ? results.map(result => result.insertId)
          : [results.insertId];
        const projectHashtagQueries = hashtagIds.map(
          hashtagId => `
          INSERT INTO projecthashtag (project_id, hashtag_id)
          VALUES (?, ?)
        `
        );
        const projectHashtagValues = hashtagIds.map(hashtagId => [
          projectId,
          hashtagId,
        ]);

        connection.query(
          projectHashtagQueries.join("; "),
          [].concat(...projectHashtagValues),
          error => {
            if (error) {
              console.error("Error inserting project hashtags:", error);
              res.status(500).send("Server error");
              return;
            }
            res.status(201).json({ message: "Project created", projectId });
          }
        );
      });
    } else {
      res.status(201).json({ message: "Project created", projectId });
    }
  });
});

// 회원가입 API
app.post("/api/register", async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO user (email, password, username) VALUES (?, ?, ?)`;
    connection.query(
      query,
      [email, hashedPassword, nickname],
      (error, results) => {
        if (error) {
          console.error("Error inserting user:", error);
          return res.status(500).send("Server error");
        }

        res.status(201).send("User registered");
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Server error");
  }
});

// 로그인 API
app.post("/api/login", (req, res) => {
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
});

// 닉네임 중복 확인 API
app.get("/api/check-nickname", (req, res) => {
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
});

// 프로젝트 목록 가져오기 API
app.get("/api/projects", (req, res) => {
  const query = `
    SELECT p.*, u.username AS author
    FROM project p
    JOIN user u ON p.created_by = u.id
    ORDER BY p.created_at DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching projects:", error);
      res.status(500).send("Server error");
      return;
    }
    res.status(200).json(results);
  });
});

// 프로젝트 해시태그 가져오기 API
app.get("/api/project/:id/hashtags", (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT h.name
    FROM hashtag h
    JOIN projecthashtag ph ON h.id = ph.hashtag_id
    WHERE ph.project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching hashtags:", error);
      res.status(500).send("Server error");
      return;
    }

    const hashtags = results.map(row => row.name);
    res.status(200).json(hashtags);
  });
});

// 프로젝트 현재 참가자 수 가져오기 API
app.get("/api/project/:id/participants", (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT COUNT(*) as currentParticipants
    FROM participant
    WHERE project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching participants:", error);
      res.status(500).send("Server error");
      return;
    }

    const currentParticipants = results[0].currentParticipants;
    res.status(200).json({ currentParticipants });
  });
});

// 프로젝트 좋아요 수 가져오기 API
app.get("/api/project/:id/honey", (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT COUNT(*) as honeyCount
    FROM honeypot
    WHERE project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching honeypot count:", error);
      res.status(500).send("Server error");
      return;
    }

    const honeyCount = results[0].honeyCount;
    res.status(200).json({ honeyCount });
  });
});

// 좋아요 추가 API
app.post("/api/project/:id/honey", (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const query = `
    INSERT INTO honeypot (project_id, user_id)
    VALUES (?, ?)
  `;

  connection.query(query, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error adding honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    res.status(201).send("Honeypot added");
  });
});

// 좋아요 제거 API
app.delete("/api/project/:id/honey", (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const query = `
    DELETE FROM honeypot
    WHERE project_id = ? AND user_id = ?
  `;

  connection.query(query, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error removing honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    res.status(200).send("Honeypot removed");
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
