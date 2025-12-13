var express = require("express");
var router = express.Router();
var connexController = require("./connex");

router.post("/login", connexController.login);

module.exports = router;



