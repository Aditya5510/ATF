const express = require("express");
const router = express.Router();
const applicantControllers = require("../Controllers/candidateController");
const verifyToken = require("../MIddlewares/auth");

router.post("/application/:id", applicantControllers.application);

module.exports = router;
