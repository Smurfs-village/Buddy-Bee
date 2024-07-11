const express = require("express");
const projectController = require("../controllers/projectController");
const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/search", projectController.searchProjects);
router.get("/:id", projectController.getProjectById);
router.get("/:id/hashtags", projectController.getProjectHashtags);
router.get("/:id/participants", projectController.getProjectParticipants);
router.get("/:id/honey", projectController.getProjectHoney);
router.post("/:id/honey", projectController.addProjectHoney);
router.delete("/:id/honey", projectController.removeProjectHoney);
router.patch("/:id/increment-view", projectController.incrementViewCount);
router.post("/:id/toggle-honey", projectController.toggleHoney);
router.get("/:id/honey/:userId", projectController.checkProjectHoney);

module.exports = router;
