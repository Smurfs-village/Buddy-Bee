const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

// MySQL 연결 설정
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

// content에서 첫 번째 이미지를 추출하는 함수
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
  } = req.body;
  const mainImage = extractFirstImage(content);

  const createProjectQuery = `
    INSERT INTO project (title, description, type, target_amount, start_date, end_date, created_by, max_participants, options, main_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const projectValues = [
    title,
    content,
    type,
    targetAmount,
    startDate,
    endDate,
    createdBy,
    maxParticipants,
    JSON.stringify(options),
    mainImage,
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
            res.status(201).send("Project created");
          }
        );
      });
    } else {
      res.status(201).send("Project created");
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

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
