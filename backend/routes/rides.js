const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");

// 1. Rechercher des covoiturages (avec filtres)
router.get("/", async (req, res) => {
    try {
        const { villeDepart, villeArrivee, date, prixMax } = req.query;
        
        let filter = {};

        // Filtres obligatoires ou optionnels selon votre logique
        if (villeDepart) filter.villeDepart = new RegExp(villeDepart, 'i'); // Insensible à la casse
        if (villeArrivee) filter.villeArrivee = new RegExp(villeArrivee, 'i');
        
        // Filtre date (Format AAMMJJ)
        if (date) {
            filter.date = Number(date);
        }

        // Filtre prix maximum
        if (prixMax) {
            filter.prix = { $lte: Number(prixMax) };
        }

        // Ne montrer que les trajets avec des places disponibles 
        filter.nbPlaces = { $gt: 0 };

        const rides = await Ride.find(filter);
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des trajets" });
    }
});

// 2. Créer un trajet (Proposition)
router.post("/", async (req, res) => {
    try {
        // Le format de date doit être géré en amont ou converti ici
        const newRide = new Ride(req.body);
        const savedRide = await newRide.save();
        res.status(201).json({ message: "Trajet créé", ride: savedRide });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. Suppression (Optionnel mais utile)
router.delete("/:id", async (req, res) => {
    try {
        await Ride.findByIdAndDelete(req.params.id);
        res.json({ message: "Trajet supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur suppression" });
    }
});

module.exports = router;


