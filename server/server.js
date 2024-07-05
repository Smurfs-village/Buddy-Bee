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
      const hashtagQueries = hashtags.map(
        tag => `
        INSERT INTO hashtag (name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
      `
      );
      const hashtagValues = hashtags.map(tag => [tag]);

      connection.query(
        hashtagQueries.join("; "),
        [].concat(...hashtagValues),
        (error, results) => {
          if (error) {
            console.error("Error inserting hashtags:", error);
            res.status(500).send("Server error");
            return;
          }

          const hashtagIds = results.map(result => result.insertId);
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
            }
          );
        }
      );
    }

    res.status(201).send("Project created");
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
