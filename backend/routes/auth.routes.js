const express = require("express");
const router = express.Router();

const connexController = require("../routes/connex");

// LOGIN 
router.post("/login", connexController.login);

module.exports = router;



