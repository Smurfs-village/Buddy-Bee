const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/check-nickname", authController.checkNickname);
router.get("/auth/me", authMiddleware, authController.getMe); // authMiddleware 추가
router.put(
  "/user/change-password",
  authMiddleware,
  authController.changePassword // authController 사용
);
router.post("/auth/kakao", authController.kakaoLogin); // 카카오 로그인 라우트 추가

module.exports = router;
