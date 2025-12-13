var express = require("express");
var router = express.Router();
var Ride = require("../models/Ride");

// Recherche
router.get("/", async function(req, res) {
    try {
        var villeDepart = req.query.villeDepart;
        var villeArrivee = req.query.villeArrivee;
        var date = req.query.date;
        var filter = {};

        if (villeDepart) filter.villeDepart = new RegExp(villeDepart, 'i');
        if (villeArrivee) filter.villeArrivee = new RegExp(villeArrivee, 'i');
        if (date) filter.date = Number(date);
        
        filter.nbPlaces = { $gt: 0 };

        var rides = await Ride.find(filter);
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Création
router.post("/", async function(req, res) {
    try {
        var newRide = new Ride(req.body);
        var savedRide = await newRide.save();
        res.status(201).json({ message: "Trajet créé", ride: savedRide });
    } catch (err) {
        res.status(400).json({ error: "Erreur données" });
    }
});

module.exports = router;

