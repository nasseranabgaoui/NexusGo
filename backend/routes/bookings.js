const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking"); // Mongoose model

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings); // JSON will already have id instead of _id
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Réservation créée", id: booking.id });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Update a booking partially
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if (!booking) return res.status(404).json({ error: "Réservation non trouvée" });
    res.json({ message: "Réservation modifiée", booking });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Delete a booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: "Réservation non trouvée" });
    res.json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
