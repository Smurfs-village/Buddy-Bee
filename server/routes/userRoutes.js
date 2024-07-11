const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/user", authMiddleware, userController.getUserProfile);
router.put("/user", authMiddleware, userController.updateUserProfile);

module.exports = router;
