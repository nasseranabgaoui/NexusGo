var express = require("express");
var router = express.Router();
var Ride = require("../models/Ride");

router.get("/", async (req, res) => {
    var query = {};

    if (req.query.villeDepart) {
        query.villeDepart = req.query.villeDepart;
    }
    if (req.query.villeArrivee) {
        query.villeArrivee = req.query.villeArrivee;
    }
    if (req.query.date) {
        query.date = req.query.date;
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
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;