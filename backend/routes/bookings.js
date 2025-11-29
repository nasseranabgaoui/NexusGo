const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

// Création d’une réservation avec décrémentation des places (Version simplifiée)
router.post("/", async (req, res) => {
    try {
        const { idProposition, emailPassager } = req.body;

        // 1. Vérifier si le trajet existe
        const ride = await Ride.findById(idProposition);

        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable" });
        }

        // 2. Vérifier s'il reste des places
        if (ride.nbPlaces <= 0) {
            return res.status(400).json({ message: "Désolé, ce trajet est complet !" });
        }

        // 3. Décrémenter le nombre de places et sauvegarder le trajet
        ride.nbPlaces -= 1;
        await ride.save();

        // 4. Créer la réservation
        const newBooking = new Booking({
            idProposition,
            emailPassager
        });
        await newBooking.save();

        res.status(201).json({ message: "Réservation confirmée", booking: newBooking });

    } catch (err) {
        console.error("Erreur réservation:", err);
        res.status(500).json({ error: "Erreur serveur lors de la réservation" });
    }
});

// Récupérer les réservations
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find().populate("idProposition");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
