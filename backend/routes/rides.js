var express = require("express");
var router = express.Router();
var Ride = require("../models/Ride");

// Recherche 
router.get("/", async (req, res) => {
    var query = {};

    if (req.query.villeDepart) {
        query.villeDepart = new RegExp(req.query.villeDepart, 'i');
    }
    if (req.query.villeArrivee) {
        query.villeArrivee = new RegExp(req.query.villeArrivee, 'i');
    }
    if (req.query.date) {
        query.date = Number(req.query.date); 
    }

    if (req.query.prixMax) {
        const maxPriceNumber = parseFloat(req.query.prixMax);
        
        if (!isNaN(maxPriceNumber)) {
            query.prix = { $lte: maxPriceNumber }; 
        }
    }
    
    
    query.nbPlaces = { $gt: 0 };

    try {
        var rides = await Ride.find(query).sort({ date: 1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la recherche" });
    }
});


// Création 
router.post("/", async function(req, res) {
    try {
        var newRide = new Ride(req.body);
        var savedRide = await newRide.save();
        res.status(201).json({ message: "Trajet créé", ride: savedRide });
    } catch (err) {
        res.status(400).json({ error: "Erreur lors de l'enregistrement du trajet (mauvaises données fournies)" });
    }
});

module.exports = router;