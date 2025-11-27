const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride"); // Mongoose model

// Get all rides
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides); // JSON already has id instead of _id
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Create a new ride
router.post("/", async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.json({ message: "Trajet créé", id: ride.id });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Update a ride partially
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findByIdAndUpdate(id, req.body, { new: true });
    if (!ride) return res.status(404).json({ error: "Trajet non trouvé" });
    res.json({ message: "Trajet modifié", ride });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Delete a ride
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findByIdAndDelete(id);
    if (!ride) return res.status(404).json({ error: "Trajet non trouvé" });
    res.json({ message: "Trajet supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
