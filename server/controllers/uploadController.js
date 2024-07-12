const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("../models/db");

const uploadDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadFile = upload.single("file");

exports.uploadProfileImage = upload.single("profileImage");

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
  const userId = req.user.userId;
  const query = "UPDATE user SET profile_image = ? WHERE id = ?";
  connection.query(query, [url, userId], err => {
    if (err) {
      console.error("Error updating profile image in database:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json({ filename: req.file.filename, url });
  });
};
