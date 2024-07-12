const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("../models/db");

// 일반 파일 업로드 경로 설정
const generalUploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(generalUploadDir)) {
  fs.mkdirSync(generalUploadDir);
}

// 프로필 이미지 업로드 경로 설정
const profileUploadDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir);
}

// 일반 파일 업로드 설정
const generalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, generalUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 프로필 이미지 업로드 설정
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadGeneral = multer({ storage: generalStorage });
const uploadProfile = multer({ storage: profileStorage });

exports.uploadFile = uploadGeneral.single("file");

exports.uploadProfileImage = uploadProfile.single("profileImage");

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ filename: req.file.filename, url });
};

exports.handleProfileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/profiles/${
    req.file.filename
  }`;

  // 사용자 정보 업데이트
  const userId = req.user.id;
  const query = "UPDATE user SET profile_image = ? WHERE id = ?";
  connection.query(query, [url, userId], err => {
    if (err) {
      console.error("Error updating profile image in database:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json({ filename: req.file.filename, url });
  });
};
