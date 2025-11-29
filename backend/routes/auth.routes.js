const express = require("express");
const router = express.Router();

// Importer correctement connexController
const connexController = require("../routes/connex"); // Chemin vers connex.js

// Route de connexion
router.post("/login", connexController.login); // Maintenant, on utilise connexController.login

module.exports = router;


