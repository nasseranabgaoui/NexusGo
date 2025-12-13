var express = require("express");
var router = express.Router();
var Booking = require("../models/Booking");
var Ride = require("../models/Ride");

// Réservation
router.post("/", async function(req, res) {
    try {
        var idProposition = req.body.idProposition;
        var emailPassager = req.body.emailPassager;

        var ride = await Ride.findById(idProposition);
        
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable" });
        }
        if (ride.nbPlaces <= 0) {
            return res.status(400).json({ message: "Complet !" });
        }

        ride.nbPlaces = ride.nbPlaces - 1;
        await ride.save();

        var newBooking = new Booking({
            idProposition: idProposition,
            emailPassager: emailPassager
        });
        await newBooking.save();

        res.status(201).json({ message: "Réservation confirmée" });

    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;