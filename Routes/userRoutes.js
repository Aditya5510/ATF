const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/userController");
const verifyToken = require("../MIddlewares/auth");

router.post("/register", userControllers.register);

router.post("/opening", verifyToken, userControllers.createOpening);

module.exports = router;
