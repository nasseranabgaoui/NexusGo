const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 1. Récupérer tous les utilisateurs (GET /users)
router.get("/", async (req, res) => {
    try {
        // On récupère tout le monde SAUF le champ mot de passe (sécurité)
        const users = await User.find().select("-motDePasse");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 2. Récupérer un seul utilisateur par son ID (GET /users/:id)
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-motDePasse");
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 3. Supprimer un utilisateur (DELETE /users/:id)
router.delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur suppression" });
    }
});

module.exports = router;


