const express = require("express");
const router = express.Router();
const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Récupération de toutes les réservations
router.get("/", async (req, res) => {
    try {
        const bookings = await getDB().collection("bookings").find().toArray();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Création d’une réservation
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const result = await getDB().collection("bookings").insertOne(body);
        res.json({ message: "Réservation créée", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modification partielle
router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await getDB()
            .collection("bookings")
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );

        res.json({ message: "Réservation modifiée" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Suppression
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await getDB()
            .collection("bookings")
            .deleteOne({ _id: new ObjectId(id) });

        res.json({ message: "Réservation supprimée" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
