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

module.exports = router;
