const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/check-nickname", authController.checkNickname);
router.get("/auth/me", authController.getMe);

module.exports = router;
