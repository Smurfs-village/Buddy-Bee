const express = require("express");
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, projectController.createProject); // 인증 필요
router.get("/", projectController.getProjects); // 인증 불필요
router.get("/user", authMiddleware, projectController.getUserProjects); // 인증 필요
router.get("/search", projectController.searchProjects); // 인증 불필요
router.get(
  "/participated",
  authMiddleware,
  projectController.getParticipatedProjects
); // 인증 필요
router.get(
  "/bookmarked",
  authMiddleware,
  projectController.getBookmarkedProjects
); // 인증 필요
router.get("/:id", projectController.getProjectById); // 인증 불필요
router.get("/:id/hashtags", projectController.getProjectHashtags); // 인증 불필요
router.get("/:id/participants", projectController.getProjectParticipants); // 인증 불필요
router.get("/:id/honey", projectController.getProjectHoney); // 인증 불필요
router.post("/:id/honey", authMiddleware, projectController.addProjectHoney); // 인증 필요
router.delete(
  "/:id/honey",
  authMiddleware,
  projectController.removeProjectHoney
); // 인증 필요
router.patch("/:id/increment-view", projectController.incrementViewCount); // 인증 불필요
router.post("/:id/toggle-honey", authMiddleware, projectController.toggleHoney); // 인증 필요
router.get("/:id/honey/:userId", projectController.checkProjectHoney); // 인증 불필요
router.post(
  "/:id/participate",
  authMiddleware,
  projectController.participateProject
); // 새로운 참여 엔드포인트 추가

module.exports = router;
