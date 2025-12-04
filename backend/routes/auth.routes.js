const express = require("express");
const router = express.Router();

// Import du controller
const connexController = require("../routes/connex");

// Login
router.post("/login", connexController.login);

// Register (nouveau)
router.post("/register", connexController.register);

module.exports = router;


