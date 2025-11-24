const express = require("express");
const router = express.Router();
const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Récupération de tous les utilisateurs
router.get("/", async (req, res) => {
    try {
        const users = await getDB().collection("users").find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Création d’un utilisateur
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const result = await getDB().collection("users").insertOne(body);
        res.json({ message: "Utilisateur créé", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modification partielle d’un utilisateur
router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        await getDB()
            .collection("users")
            .updateOne({ _id: new ObjectId(id) }, { $set: body });

        res.json({ message: "Utilisateur modifié" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Suppression d’un utilisateur
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await getDB()
            .collection("users")
            .deleteOne({ _id: new ObjectId(id) });

        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;






