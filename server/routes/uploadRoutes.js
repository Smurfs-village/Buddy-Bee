const express = require("express");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middlewares/authMiddleware"); // 인증 미들웨어 추가
const router = express.Router();

// 기존 파일 업로드 엔드포인트
router.post(
  "/upload",
  uploadController.uploadFile,
  uploadController.handleUpload
);

// 새로운 프로필 이미지 업로드 엔드포인트
router.post(
  "/upload/profile",
  authMiddleware, // 인증 미들웨어 적용
  uploadController.uploadProfileImage,
  uploadController.handleProfileUpload
);

module.exports = router;
