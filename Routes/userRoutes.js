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

router.put(
  "/candidate/:candidateId/status",
  verifyToken,
  userControllers.toggleJobSelect
);

router.get("/dashboard", verifyToken, userControllers.getDashboardData);

module.exports = router;
