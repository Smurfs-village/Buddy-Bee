const express = require("express");
const projectController = require("../controllers/projectController");
const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.get("/:id/hashtags", projectController.getProjectHashtags);
router.get("/:id/participants", projectController.getProjectParticipants);
router.get("/:id/honey", projectController.getProjectHoney);
router.post("/:id/honey", projectController.addProjectHoney);
router.delete("/:id/honey", projectController.removeProjectHoney);

module.exports = router;
