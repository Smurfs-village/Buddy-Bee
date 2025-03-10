const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");
const updateProjectStatus = require("./scripts/updateProjectStatus");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

// 정적 파일 서빙
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// 기존 라우트 설정
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);

// 모든 경로에 대해 index.html을 응답
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const port = 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // 스크립트 실행
  updateProjectStatus();
  // 매일 자정에 상태 업데이트 실행
  cron.schedule("0 0 * * *", () => {
    console.log("Running project status update...");
    updateProjectStatus();
  });
});
