const express = require("express");
const router = express.Router();
const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Récupération de tous les trajets
router.get("/", async (req, res) => {
    try {
        const rides = await getDB().collection("rides").find().toArray();
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Création d’un trajet
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const result = await getDB().collection("rides").insertOne(body);
        res.json({ message: "Trajet créé", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modification partielle d’un trajet
router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await getDB()
            .collection("rides")
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );

        res.json({ message: "Trajet modifié" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Suppression d’un trajet
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await getDB()
            .collection("rides")
            .deleteOne({ _id: new ObjectId(id) });

        res.json({ message: "Trajet supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;


