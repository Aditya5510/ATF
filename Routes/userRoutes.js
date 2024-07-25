const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/userController");
const verifyToken = require("../MIddlewares/auth");

router.post("/register", userControllers.register);

router.post("/opening", verifyToken, userControllers.createOpening);

router.get("/getOpenings", verifyToken, userControllers.getUserJobs);

router.get("/jobopening/:jobId", verifyToken, userControllers.getOpening);

router.get("/job/:jobId", verifyToken, userControllers.compOpening);

router.put(
  "/job/:jobId/toggle-status",
  verifyToken,
  userControllers.toggleJobStatus
);

// ser/job/${jobId}/toggle-status

module.exports = router;
