const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/userController");
const verifyToken = require("../MIddlewares/auth");

router.post("/register", userControllers.register);

router.post("/opening", verifyToken, userControllers.createOpening);

router.get("/getOpenings", verifyToken, userControllers.getUserJobs);

router.get("/jobopening/:jobId", userControllers.getOpening);

router.get("/job/:jobId", userControllers.compOpening);

module.exports = router;
