// Importation des modules
const express = require("express");
const router = express.Router();

// On importe le controller d'authentification
const authController = require("../controller/auth.controller");

// Route de connexion
// L'utilisateur envoie email + password dans le body
router.post("/login", authController.login);

module.exports = router;
